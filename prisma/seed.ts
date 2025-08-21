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

  // Create default blog categories
  const categories = [
    { name: 'Sermons', slug: 'sermons', description: 'Weekly sermon posts and messages', color: '#3B82F6' },
    { name: 'Church News', slug: 'church-news', description: 'Updates and announcements from the church', color: '#10B981' },
    { name: 'Community', slug: 'community', description: 'Stories and updates from our church community', color: '#F59E0B' },
    { name: 'Events', slug: 'events', description: 'Upcoming events and activities', color: '#EF4444' },
    { name: 'Faith & Life', slug: 'faith-life', description: 'Thoughts on faith, Christian living, and spiritual growth', color: '#8B5CF6' },
  ]

  for (const [index, category] of categories.entries()) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        displayOrder: index + 1,
      },
    })
  }

  console.log('✅ Created blog categories')

  // Create default system settings
  const systemSettings = [
    { group: 'site', key: 'site_title', value: 'First Baptist Church Fenton', type: 'STRING', isPublic: true },
    { group: 'site', key: 'site_description', value: 'Growing in Faith, Sharing God\'s Love', type: 'STRING', isPublic: true },
    { group: 'site', key: 'contact_email', value: '', type: 'STRING', isPublic: false },
    { group: 'site', key: 'contact_phone', value: '', type: 'STRING', isPublic: false },
    { group: 'site', key: 'facebook_url', value: '', type: 'STRING', isPublic: true },
    { group: 'site', key: 'youtube_url', value: '', type: 'STRING', isPublic: true },
    { group: 'media', key: 'max_file_size', value: '10485760', type: 'NUMBER', isPublic: false },
    { group: 'media', key: 'allowed_file_types', value: '["image/jpeg", "image/png", "image/webp", "image/gif"]', type: 'JSON', isPublic: false },
    { group: 'blog', key: 'posts_per_page', value: '10', type: 'NUMBER', isPublic: false },
    { group: 'calendar', key: 'google_calendar_id', value: '', type: 'STRING', isPublic: false },
    { group: 'calendar', key: 'events_to_show', value: '5', type: 'NUMBER', isPublic: true },
  ]

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { 
        settingGroup_settingKey: { 
          settingGroup: setting.group, 
          settingKey: setting.key 
        }
      },
      update: {},
      create: {
        settingGroup: setting.group,
        settingKey: setting.key,
        settingValue: setting.value,
        settingType: setting.type as any,
        isPublic: setting.isPublic,
        updatedById: adminUser.id,
      },
    })
  }

  console.log('✅ Created system settings')

  // Create default editable areas
  const editableAreas = [
    // Home Page
    { pageSlug: 'home', areaKey: 'hero_title', areaLabel: 'Hero Section Title', contentType: 'TEXT', defaultValue: 'No matter where you\'ve been, you\'re welcome here.', helpText: 'Main headline that visitors see first' },
    { pageSlug: 'home', areaKey: 'hero_description', areaLabel: 'Hero Section Description', contentType: 'TEXT', defaultValue: 'Come as you are and discover the hope, truth, and grace of Jesus Christ. We are a community of real people, with real struggles, following a real Savior.', helpText: 'Supporting text under the main headline' },
    { pageSlug: 'home', areaKey: 'service_time', areaLabel: 'Sunday Service Time', contentType: 'TEXT', defaultValue: 'Sunday Service: 10:30 AM', helpText: 'When your main worship service takes place' },
    { pageSlug: 'home', areaKey: 'church_address', areaLabel: 'Church Address', contentType: 'TEXT', defaultValue: '860 N. Leroy St., Fenton, MI', helpText: 'Your church\'s physical address' },
    
    // About Page
    { pageSlug: 'about', areaKey: 'page_title', areaLabel: 'About Page Title', contentType: 'TEXT', defaultValue: 'About First Baptist Church Fenton', helpText: 'Main page title' },
    { pageSlug: 'about', areaKey: 'mission_statement', areaLabel: 'Mission Statement', contentType: 'HTML', defaultValue: '', helpText: 'Your church\'s mission statement' },
    
    // Contact Page
    { pageSlug: 'contact', areaKey: 'office_phone', areaLabel: 'Office Phone Number', contentType: 'TEXT', defaultValue: '', helpText: 'Main church office phone number' },
    { pageSlug: 'contact', areaKey: 'office_email', areaLabel: 'Office Email', contentType: 'TEXT', defaultValue: '', helpText: 'Main church office email address' },
  ]

  for (const [index, area] of editableAreas.entries()) {
    await prisma.editableArea.upsert({
      where: { 
        pageSlug_areaKey: { 
          pageSlug: area.pageSlug, 
          areaKey: area.areaKey 
        }
      },
      update: {},
      create: {
        ...area,
        contentType: area.contentType as any,
        displayOrder: index + 1,
      },
    })
  }

  console.log('✅ Created editable areas')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
