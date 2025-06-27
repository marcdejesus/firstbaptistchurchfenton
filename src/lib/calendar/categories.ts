// Event categories for mapping Google Calendar events
export const eventCategories = [
  { id: 'worship', name: 'Worship', icon: '🙏', color: '#8B5CF6', description: 'Worship services and spiritual gatherings' },
  { id: 'fellowship', name: 'Fellowship', icon: '🤝', color: '#06B6D4', description: 'Community and social events' },
  { id: 'community', name: 'Community', icon: '👨‍👩‍👧‍👦', color: '#3b82f6', description: 'Community-focused events' },
  { id: 'outreach', name: 'Outreach', icon: '💝', color: '#10B981', description: 'Service and community outreach' },
  { id: 'education', name: 'Education', icon: '📚', color: '#F59E0B', description: 'Learning and Bible study' },
  { id: 'youth', name: 'Youth', icon: '🎯', color: '#EF4444', description: 'Youth and teen activities' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#EC4899', description: 'Family-oriented events' },
  { id: 'special', name: 'Special Events', icon: '⭐', color: '#6366F1', description: 'Special occasions and holidays' }
];

// Map Google Calendar color IDs to our event categories
export const mapColorToCategory = (colorId?: string) => {
  const colorCategoryMap: Record<string, string> = {
    '9': 'worship',    // Blue
    '6': 'fellowship', // Orange  
    '2': 'community',  // Blue
    '10': 'outreach',  // Green
    '5': 'education',  // Yellow
    '11': 'youth',     // Red
    '4': 'family',     // Pink
    '8': 'special',    // Purple
  };
  
  const categoryId = colorCategoryMap[colorId || ''] || 'fellowship';
  return eventCategories.find(c => c.id === categoryId);
};

// Get color ID by category for Google Calendar
export const getColorIdByCategory = (categoryId?: string): string => {
  const categoryColorMap: Record<string, string> = {
    'worship': '9',
    'fellowship': '6',
    'community': '2',
    'outreach': '10',
    'education': '5',
    'youth': '11',
    'family': '4',
    'special': '8',
  };
  
  return categoryColorMap[categoryId || ''] || '6'; // Default to fellowship color
}; 