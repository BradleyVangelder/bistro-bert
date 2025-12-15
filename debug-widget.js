// Debug script to help identify Easybooker widget DOM elements
// Run this in browser console when the reservation widget should be loaded

console.log('=== Easybooker Widget Debug ===');

// Check if script tag is present
const scriptTag = document.querySelector('script[data-business-id="694"]');
console.log('Script tag found:', !!scriptTag, scriptTag);

// Check for any Easybooker-related elements
const allElements = document.querySelectorAll('*');
const easybookerElements = [];

allElements.forEach(element => {
  const text = element.textContent?.toLowerCase() || '';
  const className = element.className?.toLowerCase() || '';
  const id = element.id?.toLowerCase() || '';
  const onclick = element.getAttribute('onclick')?.toLowerCase() || '';
  
  if (text.includes('easybooker') || text.includes('boek') || text.includes('reserve') || 
      className.includes('easybooker') || className.includes('book') || className.includes('reserve') ||
      id.includes('easybooker') || id.includes('widget') || id.includes('book') ||
      onclick.includes('easybooker') || onclick.includes('book')) {
    easybookerElements.push({
      element: element,
      text: element.textContent?.substring(0, 50) || '',
      className: element.className,
      id: element.id,
      tag: element.tagName
    });
  }
});

console.log('Easybooker-related elements found:', easybookerElements);

// Try to manually click each element to see what works
easybookerElements.forEach((item, index) => {
  console.log(`Testing click on element ${index}:`, item);
  try {
    item.element.click();
    console.log(`Click successful on element ${index}`);
  } catch (error) {
    console.log(`Click failed on element ${index}:`, error);
  }
});

console.log('=== End Debug ===');
