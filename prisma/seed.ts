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

  // Create real FAQ entries from the website
  const realFAQs = [
    {
      question: "1. What time are Sunday services?",
      answer: "Sundays at 10:30 AM. Bible classes for all ages begin at 9:00 AM.",
      order: 1
    },
    {
      question: "2. What should I wear?",
      answer: "Come as you are! Most people dress casual or business casual.",
      order: 2
    },
    {
      question: "3. Is there something for my kids?",
      answer: "Yes! We offer nursery for infants and toddlers, and a full Kids Church for PreK–5th grade during the 10:30 AM service.",
      order: 3
    },
    {
      question: "4. How do I get involved in a small group?",
      answer: "Visit our Next Steps page or stop by the Welcome Center. We'll help you find a group that fits your schedule and stage of life.",
      order: 4
    },
    {
      question: "5. How do I become a member?",
      answer: "We offer a membership class quarterly. It's a great chance to learn about our beliefs, leadership, and mission. Sign up through our Next Steps page or email discipleship@fbfenton.org.",
      order: 5
    },
    {
      question: "6. Do you offer counseling?",
      answer: "Yes, we provide biblical counseling for individuals, couples, and families. Visit our counseling page or email counseling@fbcfenton.org.",
      order: 6
    },
    {
      question: "7. How can I serve?",
      answer: "There are many opportunities to serve—from kids and youth to worship, tech, and missions. Fill out the Volunteer Interest Form on our Volunteer page.",
      order: 7
    },
    {
      question: "8. What denomination are you?",
      answer: "We are an independent Baptist church committed to the authority of Scripture and the centrality of the gospel.",
      order: 8
    },
    {
      question: "9. Do you livestream your services?",
      answer: "Yes! You can watch live on our YouTube channel or find past messages in our sermon archive.",
      order: 9
    },
    {
      question: "10. How can I talk to a pastor?",
      answer: "Reach out anytime by emailing info@fbcfenton.org or calling the church office. A pastor will be glad to connect with you.",
      order: 10
    }
  ]

  for (const faq of realFAQs) {
    await prisma.fAQ.upsert({
      where: { id: faq.order },
      update: {},
      create: {
        ...faq,
        createdBy: adminUser.id,
      },
    })
  }

  console.log('✅ Created real FAQs from website')

  // Create real donate settings from the website
  await prisma.donateSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      donateUrl: 'https://www.paypal.com/donate?token=6-wnb_Sj_MupmasvWZnxJSDO899HjDQcX5bp4X63zwZrAL0QI_VKxgXHkGaWENDHRxbNG4Yw5txQpqKA',
      description: 'We want giving to be simple, secure, and impactful. Your generosity helps us continue our mission of making disciples and serving our community.',
      isActive: true,
    },
  })

  console.log('✅ Created real donate settings from website')

  // Create real staff members from the website
  const realStaffMembers = [
    {
      name: 'Pastor James Bell',
      position: 'Lead Teaching Pastor',
      description: "James Bell serves as the Lead Teaching Pastor of First Baptist Church of Fenton. His journey to faith is one marked by skepticism, struggle, and grace. Raised by a single mother and having grown up without a father, James carried deep wounds and questions about God, purpose, and identity. By the time he reached college, he identified as an atheist — hardened by pain, resistant to religion, and searching for truth in all the wrong places. That all began to change after an head injury landed him in the hospital. A Christian visited him there — not with judgment, but with presence and compassion. That conversation led to months of honest dialogue, raw questions, and finally, a radical encounter with the gospel of Jesus Christ. What started as curiosity became conviction. James gave his life to Christ and was never the same. After surrendering to the call of ministry, he and his wife, Susanna, moved to North Carolina to serve the homeless, lead inner-city ministries, and begin formal theological training. It was during that season God gave them a growing burden for broken people, burned-out believers, and spiritually dry churches — especially in James's hometown region. In 2016, Pastor James became the Lead Teaching Pastor of FBC Fenton, where he has faithfully preached God's Word, shepherded the church through revitalization, and led a movement focused on gospel clarity, authentic relationships, and global mission. He is known for his bold, raw, and transparent preaching, blending theological depth with real-life application. He doesn't shy away from hard conversations. His messages are marked by vulnerability, honesty, and a deep conviction that Jesus is still in the business of healing the broken and building His church. James is also the President of the Board at the Center of Hope, founder of the Pastors Connection Network, and leader of several regional and international ministry initiatives training pastors in Pakistan, India, and Thailand. James and Susanna have five wild and wonderful boys: Titus, Timothy, Tatum, Toby, and Theo. He's a devoted dad, a passionate leader, and a firm believer that the local church is still God's plan A for transforming the world. He also understands ministry pain — the unseen battles, betrayals, and burdens many pastors and families silently carry. This empathy drives his work with pastors around the world, creating safe places for leaders to rest, grow, and return to ministry with clarity and strength.",
      email: 'james@fbfenton.org',
      order: 1,
      createdBy: adminUser.id,
    },
    {
      name: 'Laurie Campau',
      position: 'Worship Leader',
      description: "Laurie has led worship at FBC since 2016. She brings a joyful, humble spirit to every service and works hard to point people to Christ through music. She's married to Brent, and they have five kids: Noelle, Annellise, Lincoln, Aksel, and Crew.",
      email: 'laurie@fbcfenton.org',
      order: 2,
      createdBy: adminUser.id,
    },
    {
      name: 'Pastor Cody',
      position: 'Families Pastor',
      description: "Cody came to faith as a teenager and felt called to ministry shortly after. He has a degree in Youth Ministry and leads all our children, youth, and family ministries. Cody and his wife Alyssa have three daughters: Audrey, Avery, and Addison. He's passionate about helping the next generation know and follow Jesus.",
      email: 'cody@fbcfenton.org',
      order: 3,
      createdBy: adminUser.id,
    }
  ]

  for (const staff of realStaffMembers) {
    await prisma.staffMember.upsert({
      where: { id: staff.order },
      update: {},
      create: staff,
    })
  }

  console.log('✅ Created real staff members from website')

  // Create real ministries from the website
  const realMinistries = [
    {
      name: 'Kids Ministry',
      description: "Rooted Kids Ministry partners with parents to make disciples by providing engaging environments for children to grow in their faith. We offer Children's small groups during the 9:30 am service led by experienced teachers, Children's Church during the 10:30 am Worship Service, and a Family Night small group on Thursday evenings at 5:30 pm with activities for children and a discussion group for parents on topics like home life, marriage, parenting, and finances. Our goal is to integrate children into the life of the church and support parents in the discipleship process.",
      imageUrl: "/rootedkids.png",
      targetAudience: 'Children',
      meetingTime: 'Sundays at 9:30 AM and 10:30 AM, Thursdays at 5:30 PM',
      contactEmail: 'cody@fbcfenton.org',
      order: 1,
      createdBy: adminUser.id,
    },
    {
      name: 'Student Ministry',
      description: "Welcome to the Student Ministry at First Baptist Church, where we partner with parents to love, serve, and disciple their children, who are an integral part of the FBC family. We provide a fun and engaging environment for students to experience the Gospel, be discipled by mentors and peers, and get involved in various church ministries on Sunday mornings. We also offer regular activities for teens to connect, unify, and grow in their faith through participation in events and activities that build lasting friendships and help them become lifelong followers of Christ.",
      imageUrl: "/groundzero.png",
      targetAudience: 'Youth',
      meetingTime: 'Sundays during services, various activities throughout the week',
      contactEmail: 'cody@fbcfenton.org',
      order: 2,
      createdBy: adminUser.id,
    },
    {
      name: 'Equip Classes',
      description: "Equip classes at First Baptist Church are designed to enable people to discover and develop their gifts, which we believe is God's strategy for changing the world. These small, instructor-led classes meet at the church building and serve as an additional resource for spiritual growth and application outside of small groups. We offer a wide variety of topics including Biblical literacy, Christian theology, finance, parenting, marriage, and gender-specific studies, typically running for 7 to 15 weeks each semester to help you grow in your understanding of God's Word and apply it effectively.",
      imageUrl: "/equip.png",
      targetAudience: 'Adults',
      meetingTime: 'Various times throughout the week, 7-15 week semesters',
      contactEmail: 'discipleship@fbfenton.org',
      order: 3,
      createdBy: adminUser.id,
    },
    {
      name: 'Small Groups',
      description: "Small Groups at First Baptist Church are where we desire everyone who calls FBC home to find lasting and purposeful community. Designed to make our Sunday gatherings feel small, these groups provide a place to belong, be cared for, and be strengthened in your journey with Jesus. They are essential to FBC life, offering opportunities to study the Bible, serve one another and our city, find purposeful accountability, and engage in discipleship. Strategically structured for growth alongside others, Small Groups are a great way to get involved and feel at home.",
      imageUrl: "/growgroups.png",
      targetAudience: 'All Ages',
      meetingTime: 'Various times throughout the week',
      contactEmail: 'discipleship@fbfenton.org',
      order: 4,
      createdBy: adminUser.id,
    }
  ]

  for (const ministry of realMinistries) {
    await prisma.ministry.upsert({
      where: { id: ministry.order },
      update: {},
      create: ministry,
    })
  }

  console.log('✅ Created real ministries from website')

  // Create real mission partners from the website
  const realMissionPartners = [
    {
      name: 'Pakistan',
      description: 'Supporting indigenous pastors and church planters with resources, biblical training, and encouragement in one of the most spiritually challenging regions in the world.',
      location: 'Pakistan',
      type: 'INTERNATIONAL',
      createdBy: adminUser.id,
    },
    {
      name: 'India',
      description: 'Partnering with a growing network of pastors who are planting churches, making disciples, and spreading the gospel in both urban and remote areas.',
      location: 'India',
      type: 'INTERNATIONAL',
      createdBy: adminUser.id,
    },
    {
      name: 'Thailand',
      description: 'Training tribal leaders and pastors to strengthen local churches and reach unreached people groups through biblical education and ongoing mentoring.',
      location: 'Thailand',
      type: 'INTERNATIONAL',
      createdBy: adminUser.id,
    }
  ]

  for (let i = 0; i < realMissionPartners.length; i++) {
    const partner = realMissionPartners[i];
    await prisma.missionPartner.upsert({
      where: { id: i + 1 },
      update: {},
      create: partner,
    })
  }

  console.log('✅ Created real mission partners from website')

  // Create a sample current series (you can update this with actual content)
  await prisma.currentSeries.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Current Teaching Series',
      description: 'Join us as we explore God\'s Word together in our current teaching series. Check back regularly for updates on new series and topics.',
      imageUrl: '/sermon.png',
      imageKey: 'sample-series-image',
      startDate: new Date(),
      isActive: true,
    },
  })

  console.log('✅ Created sample current series')

  console.log('🎉 Database seed completed successfully!')
  console.log(`
📧 Admin Login Credentials:
   Email: admin@fbcfenton.org
   Password: admin123
   
⚠️  IMPORTANT: Change the admin password immediately after first login!

📊 Content Migrated:
   ✅ 10 Real FAQs from website
   ✅ Real Donate Settings (PayPal link)
   ✅ 3 Real Staff Members (Pastor James, Laurie, Pastor Cody)
   ✅ 4 Real Ministries (Kids, Students, Equip, Small Groups)
   ✅ 3 Real Mission Partners (Pakistan, India, Thailand)
   ✅ Sample Current Series
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