window.WH_CONFIG = {
  whatsapp: '919842209604',
  phone: '+91 98422 09604',
  email: 'hello@wildholidays.in',
  siteUrl: 'https://wildholidays.in'
};

window.WH_DESTINATIONS = [
  {
    id: 'malaysia',
    name: 'Malaysia',
    slug: 'malaysia',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_24fps.mp4',
    story: 'Traverse emerald rainforests, sip tea at cliffside retreats, and end each day with twilight by the South China Sea.',
    highlights: ['Rainforest Treks', 'Island Hopping', 'Cultural Heritage'],
    duration: '6 Nights',
    price: '₹1,19,000',
    priceNum: 119000
  },
  {
    id: 'andaman',
    name: 'Andaman',
    slug: 'andaman',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/4769638/4769638-hd_1920_1080_25fps.mp4',
    story: 'Snorkel crystal-clear lagoons, sail between rocky islets, and slow down in boutique beachfront sanctuaries.',
    highlights: ['Coral Reefs', 'Scuba Diving', 'Secluded Beaches'],
    duration: '5 Nights',
    price: '₹1,08,000',
    priceNum: 108000
  },
  {
    id: 'kerala',
    name: 'Kerala',
    slug: 'kerala',
    image: 'https://images.unsplash.com/photo-1602216052126-3b40b2d2c7f7?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/6981411/6981411-uhd_2560_1440_25fps.mp4',
    story: 'Drift through backwaters at dawn, wander spice-scented trails, and find stillness in misty hill retreats.',
    highlights: ['Houseboat Cruises', 'Ayurveda', 'Tea Plantations'],
    duration: '7 Nights',
    price: '₹1,35,000',
    priceNum: 135000
  },
  {
    id: 'munnar',
    name: 'Munnar',
    slug: 'munnar',
    image: 'https://images.unsplash.com/photo-1596178065880-5994a7360bfa?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/4058823/4058823-uhd_2560_1440_25fps.mp4',
    story: 'Wake up to mist-covered tea plantations, explore hidden waterfalls, and enjoy unforgettable sunsets above the valleys.',
    highlights: ['Tea Estates', 'Wildlife', 'Mountain Views'],
    duration: '4 Nights',
    price: '₹65,000',
    priceNum: 65000
  },
  {
    id: 'ooty',
    name: 'Ooty',
    slug: 'ooty',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_24fps.mp4',
    story: 'Ride heritage railways through the Nilgiris, breathe in botanical gardens, and embrace colonial hill-station charm.',
    highlights: ['Toy Train', 'Botanical Gardens', 'Nilgiri Hills'],
    duration: '3 Nights',
    price: '₹45,000',
    priceNum: 45000
  },
  {
    id: 'goa',
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80',
    video: 'https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_24fps.mp4',
    story: 'Golden sands, Portuguese heritage, spice-scented markets and the freedom of endless coastal horizons.',
    highlights: ['Beach Life', 'Heritage Walks', 'Coastal Dining'],
    duration: '5 Nights',
    price: '₹68,000',
    priceNum: 68000
  }
];

window.WH_HERO_DESTINATIONS = window.WH_DESTINATIONS;

window.whWhatsApp = (msg) => {
  const url = `https://wa.me/${WH_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

window.whFormatPrice = (num) => `₹${num.toLocaleString('en-IN')}`;

window.whBookMessage = (pkg) =>
  `Hello Wild Holidays!\n\nI'd like to enquire about:\nDestination: ${pkg.title || pkg.name}\nDuration: ${pkg.duration || 'Flexible'}\nBudget: ${pkg.price || whFormatPrice(pkg.priceNum)}\n\nPlease help me plan this journey.`;
