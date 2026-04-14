const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

const baseNames = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Cetirizine', 'Pantoprazole', 'Metformin', 'Amlodipine', 'Omeprazole', 'Azithromycin', 'Diclofenac', 'Levocetirizine', 'Rabeprazole', 'Telmisartan', 'Losartan', 'Atorvastatin', 'Rosuvastatin', 'Glimepiride', 'Ondansetron', 'Domperidone', 'Ranitidine', 'Aspirin', 'Clopidogrel', 'Ciprofloxacin', 'Cefixime', 'Doxycycline', 'Metronidazole', 'Pregabalin', 'Gabapentin', 'Tramadol', 'Vitamin D3', 'Vitamin C', 'B-Complex', 'Calcium', 'Iron', 'Zinc', 'Magnesium', 'Levothyroxine', 'Montelukast', 'Salbutamol', 'Budesonide', 'Fexofenadine', 'Hydroxyzine', 'Fluconazole', 'Ketoconazole', 'Luliconazole', 'Clotrimazole', 'Mometasone', 'Clobetasol', 'Betamethasone', 'Diclofenac Gel', 'Lidocaine'];
const brands = ['Cipla', 'Sun Pharma', 'Dr. Reddy', 'Lupin', 'Alkem', 'Torrent', 'Mankind', 'Abbott', 'GSK', 'Pfizer', 'Novartis', 'Sanofi', 'AstraZeneca', 'Zydus', 'Glenmark', 'Intas', 'Macleods', 'Aristo', 'Micro Labs', 'Wockhardt'];
const formulas = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Liquid', 'Powder'];
const doses = ['50mg', '100mg', '200mg', '250mg', '400mg', '500mg', '600mg', '650mg', '1000mg'];
const pharmacies = ['PharmEasy', '1mg (Tata 1mg)', 'Apollo Pharmacy', 'Netmeds'];

const getLogo = (site) => {
  if (site === 'PharmEasy') return 'pharmeasy';
  if (site === '1mg (Tata 1mg)') return '1mg';
  if (site === 'Apollo Pharmacy') return 'apollo';
  return 'netmeds';
};

const medicines = [];

medicines.push({
  name: 'Combiflam',
  dosage: '400mg/325mg tablets',
  packSize: '20 tablets',
  category: 'Pain Relief',
  prices: [
    { site: 'PharmEasy', price: 38.00, mrp: 55.00, stock: 'In Stock', link: 'https://pharmeasy.in/search/all?name=combiflam', logo: 'pharmeasy' },
    { site: '1mg (Tata 1mg)', price: 45.00, mrp: 55.00, stock: 'In Stock', link: 'https://www.1mg.com/search/all?name=combiflam', logo: '1mg' },
    { site: 'Apollo Pharmacy', price: 50.00, mrp: 55.00, stock: 'Limited Stock', link: 'https://www.apollopharmacy.in/search-medicines/combiflam', logo: 'apollo' },
    { site: 'Netmeds', price: 47.00, mrp: 55.00, stock: 'In Stock', link: 'https://www.netmeds.com/catalogsearch/result/combiflam/all', logo: 'netmeds' }
  ]
});

medicines.push({
  name: 'Dolo 650',
  dosage: '650mg tablets',
  packSize: '15 tablets',
  category: 'Fever & Pain',
  prices: [
    { site: 'PharmEasy', price: 28.00, mrp: 32.00, stock: 'In Stock', link: 'https://pharmeasy.in/search/all?name=dolo', logo: 'pharmeasy' },
    { site: 'Apollo Pharmacy', price: 30.00, mrp: 32.00, stock: 'In Stock', link: 'https://www.apollopharmacy.in/search-medicines/dolo', logo: 'apollo' },
    { site: 'Netmeds', price: 31.00, mrp: 34.00, stock: 'Out of Stock', link: 'https://www.netmeds.com/catalogsearch/result/dolo/all', logo: 'netmeds' }
  ]
});

medicines.push({
  name: 'Amoxicillin 500mg',
  dosage: '500mg capsules',
  packSize: '30 capsules',
  category: 'Antibiotic',
  prices: [
    { site: 'PharmEasy', price: 129.00, mrp: 179.00, stock: 'In Stock', link: '#', logo: 'pharmeasy' },
    { site: '1mg (Tata 1mg)', price: 145.00, mrp: 189.00, stock: 'In Stock', link: '#', logo: '1mg' },
    { site: 'Apollo Pharmacy', price: 152.00, mrp: 185.00, stock: 'Limited Stock', link: '#', logo: 'apollo' },
    { site: 'Netmeds', price: 159.00, mrp: 195.00, stock: 'In Stock', link: '#', logo: 'netmeds' }
  ]
});

while (medicines.length < 500) {
  const base = baseNames[Math.floor(Math.random() * baseNames.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const form = formulas[Math.floor(Math.random() * formulas.length)];
  const dose = doses[Math.floor(Math.random() * doses.length)];
  const name = brand + ' ' + base + ' ' + dose;
  
  const basePrice = Math.floor(Math.random() * 500) + 20;

  const priceOptions = [];
  pharmacies.forEach(phar => {
    if (Math.random() > 0.2) {
      const discount = Math.random() * 0.3;
      const price = Math.round(basePrice * (1 - discount));
      priceOptions.push({
        site: phar,
        price: price,
        mrp: basePrice,
        stock: Math.random() > 0.1 ? 'In Stock' : 'Out of Stock',
        link: 'https://google.com/search?q=buy+' + encodeURIComponent(name),
        logo: getLogo(phar)
      });
    }
  });

  if (priceOptions.length > 0) {
    let duplicate = medicines.find(m => m.name === name);
    if(!duplicate) {
      medicines.push({
        name: name,
        dosage: dose + ' ' + form.toLowerCase() + 's',
        packSize: Math.floor(Math.random() * 20 + 10) + ' ' + form.toLowerCase() + 's',
        category: 'General Pharmacy',
        prices: priceOptions
      });
    }
  }
}

fs.writeFileSync(path.join(targetDir, 'medicinesDb.json'), JSON.stringify(medicines, null, 2));
console.log('500 Medicines Generated!');
