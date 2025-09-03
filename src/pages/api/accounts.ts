import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Fixed bonus of referral 
const BONUS_AMOUNT = 100

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { accountId, introducerId } = req.body

    // STEP 1 First customer (when create first customer account no need to set introducerId)
    if (!introducerId) {
      const newCustomer = await prisma.account.create({
        data: {
          accountId,
          introducerId: null,
          beneficiaryId: null,
        },
      })
      return res.status(201).json({
        message: 'First customer created successfully. No referral bonus applied.',
        account: newCustomer,
      })
    }

    // STEP 2 Introducer exists
    const introducer = await prisma.account.findUnique({
      where: { accountId: introducerId },
    })

    if (!introducer) {
      return res.status(404).json({ message: 'Introducer not found' })
    }

    // Count how many referrals this introducer already made
    const referralCount = await prisma.account.count({
      where: { introducerId },
    })

    const newReferralNumber = referralCount + 1

    // STEP 3 Determine who gets the bonus
    let bonusRecipientId: string | null = null

    if (newReferralNumber % 2 === 1) {
      // Odd referral -> introducer gets bonus
      bonusRecipientId = introducer.accountId
    } else {
         // Correct logic for even referral: introducer's introducer's beneficiary
        const introducersIntroducerId = introducer.introducerId
      // Even referral -> introducer's introducer's beneficiary
      // First, find the introducer's introducer

      if (introducersIntroducerId) {
        const introducersIntroducer = await prisma.account.findUnique({
          where: { accountId: introducersIntroducerId },
        })

        // Then, find that introducer's beneficiary
        if (introducersIntroducer) {
          bonusRecipientId = introducersIntroducer.beneficiaryId
        }
      }
    }

    // STEP 4 Create new customer and set BeneficiaryID = bonus recipient
    const newCustomer = await prisma.account.create({
      data: {
        accountId,
        introducerId: introducer.accountId,
        beneficiaryId: bonusRecipientId,
      },
    })

    // STEP 5 Apply referral bonus amount
    if (bonusRecipientId) {
      await prisma.account.update({
        where: { accountId: bonusRecipientId },
        data: {
          balance: { increment: BONUS_AMOUNT },
        },
      })
    }

    return res.status(201).json({
      message: 'New account created successfully',
      account: newCustomer,
      bonusCreditedTo: bonusRecipientId,
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}