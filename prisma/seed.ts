import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fbcfenton.org' },
    update: {},
    create: {
      email: 'admin@fbcfenton.org',
      name: 'Site Administrator',
      role: 'ADMIN',
      passwordHash: hashedPassword,
      isActive: true,
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create default FAQ entries
  const defaultFAQs = [
    {
      question: "What time do services start?",
      answer: "Our Sunday morning worship service begins at 10:30 AM. We also have various ministries throughout the week - check our events calendar for specific times.",
      order: 1
    },
    {
      question: "What should I wear to church?",
      answer: "Come as you are! We believe that God cares more about your heart than your appearance. You'll see people in everything from jeans to suits, and all are welcome.",
      order: 2
    },
    {
      question: "Do you have programs for children?",
      answer: "Yes! We have age-appropriate programs for children during our worship service, including nursery care for infants and toddlers, and children's ministry for school-age kids.",
      order: 3
    },
    {
      question: "How can I get involved?",
      answer: "There are many ways to get involved! You can join a ministry, volunteer for events, participate in small groups, or simply attend our services and fellowship events. Contact us to learn more!",
      order: 4
    }
  ]

  for (const faq of defaultFAQs) {
    await prisma.fAQ.upsert({
      where: { id: faq.order },
      update: {},
      create: {
        ...faq,
        createdBy: adminUser.id,
      },
    })
  }

  console.log('✅ Created default FAQs')

  // Create default donate settings
  await prisma.donateSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      donateUrl: 'https://tithe.ly/give?c=1234567',
      description: 'Your generous gifts help us serve our community and spread God\'s love. Thank you for your support!',
      isActive: true,
    },
  })

  console.log('✅ Created donate settings')

  // Create sample staff member
  await prisma.staffMember.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Pastor John Smith',
      position: 'Lead Pastor',
      description: 'Pastor John has been serving our congregation for over 10 years, bringing passion for God\'s word and love for our community.',
      email: 'pastor@fbcfenton.org',
      order: 1,
      createdBy: adminUser.id,
    },
  })

  console.log('✅ Created sample staff member')

  // Create sample ministry
  await prisma.ministry.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Youth Ministry',
      description: 'Our youth ministry serves students in grades 6-12, providing a safe place to grow in faith, build friendships, and have fun!',
      targetAudience: 'Youth',
      meetingTime: 'Wednesdays at 7:00 PM',
      contactEmail: 'youth@fbcfenton.org',
      order: 1,
      createdBy: adminUser.id,
    },
  })

  console.log('✅ Created sample ministry')

  // Create sample mission partner
  await prisma.missionPartner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Local Food Bank',
      description: 'We partner with the local food bank to provide meals for families in need in our community.',
      location: 'Fenton, MI',
      type: 'LOCAL',
      createdBy: adminUser.id,
    },
  })

  console.log('✅ Created sample mission partner')

  console.log('🎉 Database seed completed successfully!')
  console.log(`
📧 Admin Login Credentials:
   Email: admin@fbcfenton.org
   Password: admin123
   
⚠️  IMPORTANT: Change the admin password immediately after first login!
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })