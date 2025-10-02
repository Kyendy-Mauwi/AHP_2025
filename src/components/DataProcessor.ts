export interface HousingData {
  county: string;
  location: string;
  projectName: string;
  projectStatus: string;
  totalUnits: number | null;
  unitType: string;
  availableUnits: string;
  price: number;
  tpsPerMonth: number | null;
  category: string; // Social, Affordable, Market
  bedrooms: number | null;
}

export const processCSVData = (csvText: string): HousingData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    // Parse price - remove "KES " and commas
    const priceStr = values[7] || '0';
    const price = parseFloat(priceStr.replace(/KES\s|,/g, '').replace(/"/g, ''));
    
    // Parse TPS per Month
    const tpsStr = values[8] || '';
    const tpsPerMonth = tpsStr ? parseFloat(tpsStr.replace(/KES\s|,/g, '').replace(/"/g, '')) : null;
    
    // Parse total units
    const totalUnitsStr = values[4] || '';
    const totalUnits = totalUnitsStr && totalUnitsStr.replace(/,/g, '') !== '' ? 
      parseInt(totalUnitsStr.replace(/,/g, '').replace(/"/g, '')) : null;
    
    // Determine category and bedroom count from unit type
    const unitType = values[5] || '';
    const category = determineCategory(unitType);
    const bedrooms = extractBedroomCount(unitType);
    
    return {
      county: values[0] || '',
      location: values[1] || '',
      projectName: values[2] || '',
      projectStatus: values[3] || '',
      totalUnits,
      unitType,
      availableUnits: values[6] || '',
      price: isNaN(price) ? 0 : price,
      tpsPerMonth,
      category,
      bedrooms
    };
  }).filter(item => item.county && item.price > 0);
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

const determineCategory = (unitType: string): string => {
  const type = unitType.toLowerCase();
  if (type.includes('social')) return 'Social';
  if (type.includes('market')) return 'Market';
  if (type.includes('affordable')) return 'Affordable';
  return 'Other';
};

const extractBedroomCount = (unitType: string): number | null => {
  const type = unitType.toLowerCase();
  if (type.includes('studio') || type.includes('bedsitter')) return 0;
  if (type.includes('1 room') || type.includes('1 bedroom')) return 1;
  if (type.includes('2 room') || type.includes('2 bedroom')) return 2;
  if (type.includes('3 room') || type.includes('3 bedroom')) return 3;
  if (type.includes('4 room') || type.includes('4 bedroom')) return 4;
  return null;
};

export const csvData = `COUNTY, LOCATION, PROJECT NAME, PROJECT STATUS, TOTAL UNITS per Project, UNITS, AVAILABLE UNITS, PRICE (KES), TPS per Month (KES)
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 1 Room Unit, Available, "KES 640,000.00", "KES 3,800.00" 
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 2 Room Unit, Available, "KES 960,000.00", "KES 5,200.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 3 Room Unit, Available, "KES 1,280,000.00", "KES 6,500.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, Studio Unit, Available, "KES 1,000,000.00", "KES 7,600.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"
Elgeyo Marakwet, Iten Town, Boma Yangu Iten Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 4,800,000.00", "KES 44,300.00"

Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,800.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,200.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,500.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, Studio Unit, Available, "KES 1,000,000.00", "KES 7,600.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"
Lamu, Mokowe, Boma Yangu Mokowe Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 4,800,000.00", "KES 44,300.00"

Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,800.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,200.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"
Meru, Meru, Boma Yangu Meru 2 Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 4,800,000.00", "KES 44,300.00"

Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,800.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"
Meru, Meru, Boma Yangu Meru 1 Estate, Ongoing,, 3 Bedroom Unit Market ,Available, "KES 4,800,000.00", "KES 44,300.00"

Meru, Timau, Boma Yangu Timau Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,800.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,200.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,500.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"
Meru, Timau, Boma Yangu Timau Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 480,000.00", "KES 44,300.00"

Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, Studio Unit Social, Available, "KES 640,000.00", "KES 3,900.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,243.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 1 Bedroom Unit Social, Available,"KES 960,000.00", "KES 5,350.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 2 Bedroom Unit Social, Available,"KES 1,280,000.00", "KES 6,800.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 1 Bedroom Unit Affordable, Available, "KES 1,500,000.00", "KES 10,850.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 14,445.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 21,680.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 2,400,000.00", "KES 21,155.00"
Kakamega, Kakamega, Boma Yangu Kakamega Lurambi Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 31,750.00"

Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,250.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,900.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,350.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 14,450.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 21,680.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 31,750.00"
Taita Taveta, Voi, Boma Yangu Voi Pool Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 4,800,000.00", "KES 42,320.00"

Nairobi, Nairobi, Boma Yangu Kibra Lot 3 Estate, Ongoing,, Studio Unit, Available, "KES 1,000,000.00", "KES 7,250.00"
Nairobi, Nairobi, Boma Yangu Kibra Lot 3 Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,900.00"
Nairobi, Nairobi, Boma Yangu Kibra Lot 3 Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,350.00"
Nairobi, Nairobi, Boma Yangu Kibra Lot 3 Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Nairobi, Nairobi, Boma Yangu Kibra Lot 3 Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 14,450.00"

Nairobi, Nairobi, Boma Yangu Shauri Moyo A Estate, Ongoing,, 1 Bedroom Unit, Available, "KES 2,003,500.00", "KES 14,470.00"
Nairobi, Nairobi, Boma Yangu Shauri Moyo A Estate, Ongoing,, 2 Bedroom Unit, Available, "KES 2,764,500.00", "KES 19,950.00"
Nairobi, Nairobi, Boma Yangu Shauri Moyo A Estate, Ongoing,, 3 Bedroom Unit, Available, "KES 3,598,000.00", "KES 26,000.00"

Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,045,000.00", "KES 5,700.00"
Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, 1 Bedroom Standard, Available, "KES 1,650,000.00", "KES 9,000.00"
Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, 2 Bedroom Standard, Available, "KES 2,255,000.00", "KES 12,200.00"
Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, 3 Bedroom Standard, Available, "KES 3,410,000.00", "KES 24,700.00"
Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, 2 Bedroom Type 2, Available, "KES 3,355,000.00", "KES 24,300.00"
Nairobi, Shauri Moyo, Boma Yangu Shauri Moyo B Estate, Ongoing,, 3 Bedroom Type 3, Available, "KES 4,510,000.00", "KES 32,700.00"

Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 1 Bedroom Unit Type 1, Available, "KES 1,650,000.00", "KES 11,950.00"
Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 2 Bedroom Unit Type 1, Available, "KES 2,200,000.00", "KES 15,900.00"
Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 3 Bedroom Unit Type 1, Available, "KES 3,300,000.00", "KES 23,850.00"
Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 1 Bedroom Unit Type 2, Available, "KES 1,980,000.00", "KES 17,450.00"
Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 2 Bedroom Unit Type 2, Available, "KES 3,465,000.00", "KES 30,550.00"
Nairobi, Starehe Constituency, Boma Yangu Starehe Point 1 Estate, Ongoing,, 3 Bedroom Unit Type 2, Available, "KES 4,125,000.00", ""

Nairobi, Nairobi, Boma Yangu Parkroad Estate, Completed,, 1 Bedroom Unit, Sold Out, "KES 1,500,000.00", ""
Nairobi, Nairobi, Boma Yangu Parkroad Estate, Completed,, 2 Bedroom Unit, Sold Out, "KES 2,000,000.00", ""
Nairobi, Nairobi, Boma Yangu Parkroad Estate, Completed,, 3 Bedroom Unit, Sold Out, "KES 3,000,000.00", "" 

Nairobi, Kibera, Boma Yangu Kibera Soweto East Zone B Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,900.00"
Nairobi, Kibera, Boma Yangu Kibera Soweto East Zone B Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,350.00"
Nairobi, Kibera, Boma Yangu Kibera Soweto East Zone B Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"

Nairobi, Athi River, Fairvalley Heights ,Ongoing,, 1 Bedroom Unit, Sold Out, "KES 2,150,000.00", ""
Nairobi, Athi River, Fairvalley Heights ,Ongoing,, 2 Bedroom Unit, Sold Out, "KES 3,350,000.00", ""
Nairobi, Athi River, Fairvalley Heights ,Ongoing,, 3 Bedroom Unit, Sold Out, "KES 4,250,000.00", ""
Nairobi, Athi River, Fairvalley Heights ,Ongoing,, 4 Bedroom Villa, Sold Out, "KES 8,000,000.00", ""

Nairobi, Pangani, Pangani Affordable Housing Project, Ongoing,, 1 Bedroom Unit ,Sold Out, "KES 1,000,000.00", ""
Nairobi, Pangani, Pangani Affordable Housing Project, Ongoing,, 2 Bedroom Unit, Sold Out, "KES 2,500,000.00", ""
Nairobi, Pangani, Pangani Affordable Housing Project, Ongoing,, 3 Bedroom Unit, Sold Out, "KES 3,000,000.00",""
Nairobi, Pangani, Pangani Affordable Housing Project, Ongoing,, Duplex, Available, "KES 9,000,000.00", ""

Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, Studio (Bedsitter) Unit Social, Available, "KES 640,000.00", "KES 3,900.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 1 Bedroom Unit Social, Available, "KES 960,000.00", "KES 5,350.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 2 Bedroom Unit Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 1 Bedroom Unit Affordable, Available, "KES 1,500,000.00", "KES 11,300.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 1 Bedroom Unit Market, Available, "KES 1,800,000.00", "KES 23,800.00"
Nairobi, South B, Boma Yangu Mukuru Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 2,400,000.00", "KES 22,200.00"

Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, Studio Unit Social, Available, "KES 640,000.00", "KES 3,800.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 1 Bedroom Unit Social, Available, "KES 960,000.00", "KES 5,200.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 2 Bedroom Unit Social, Available, "KES 1,280,000.00", "KES 6,500.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 1 Bedroom Unit Affordable, Available, "KES 1,500,000.00", "KES 11,300.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 2,400,000.00", "KES 22,200.00"
Nakuru, Bahati, Boma Yangu Bahati Nakuru Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"

Embu, Embu Town, Boma Yangu Embu NHC Estate, Ongoing,, Studio Unit, Available, "KES 1,400,000.00","KES 10,120.00"
Embu, Embu Town, Boma Yangu Embu NHC Estate, Ongoing,, 1 Bedroom Unit, Available, "KES 2,150,000.00", "KES 15,533.00"
Embu, Embu Town, Boma Yangu Embu NHC Estate, Ongoing,, 2 Bedroom Unit, Available, "KES 3,200,000.00", "KES 23,130.00"

Embu, Embu Town, Boma Yangu Embu Civil Servants Estate,	Completed,, 2 Bedroom Unit Market, Sold Out, "KES 4,200,000.00", ""	
Embu, Embu Town, Boma Yangu Embu Civil Servants Estate,	Completed,, 3 Bedroom Unit Market, Sold Out, "KES 5,400,000.00",	""

Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,250.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 1 Room Social, Available, "KES 640,000.00", "KES 3,900.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 2 Room Social, Available, "KES 960,000.00", "KES 5,350.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 3 Room Social, Available, "KES 1,280,000.00", "KES 6,800.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 14,450.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 21,680.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 31,750.00"
Nyeri, Nyeri Town, Boma Yangu Blue Valley Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 4,800,000.00", "KES 42,320.00"

Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,, Studio Unit Affordable,Available,"KES 1,000,000.00","KES 7,250.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,, 1 Room Social,Available,"KES 640,000.00","KES 3,900.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,, 2 Room Social,Available,"KES 960,000.00","KES 5,350.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,,3 Room Social,Available,"KES 1,280,000.00","KES 6,800.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,,2 Bedroom Unit Affordable,Available,"KES 2,000,000.00","KES 14,450.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,,3 Bedroom Unit Affordable,Available,"KES 3,000,000.00","KES 21,680.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,,2 Bedroom Unit Market,Available,"KES 3,600,000.00","KES 31,750.00"
Nyeri, Nyeri Town, Boma Yangu Ruring'u Estate, Ongoing,,3 Bedroom Unit Market,Available,"KES 4,800,000.00","KES 42,320.00"

Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 10,850.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Vihiga,	Vihiga Town,	Boma Yangu Vihiga Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 11,300.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 22,200.00"
Nandi,	Emgwen,	Boma Yangu Emgwen Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"

Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Nandi,	Kaptumo,	Boma Yangu Kaptumo Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 41,800.00"

Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Nandi,	Chesumei Kapsabet,	Boma Yangu Chesumei Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kiambu,	Kikuyu,	Boma Yangu Kikuyu Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,, 2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kiambu,	Thika Town,	Boma Yangu Thika Depot Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kiambu,	Lari,	Boma Yangu Lari Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Thika Town,	Boma Yangu Thika Kings Orchid Estate,	Ongoing,,	Studio Unit Affordable,	Sold Out,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Thika Town,	Boma Yangu Thika Kings Orchid Estate,	Ongoing,,	1 Bedroom Unit,	Sold Out,	"KES 1,500,000.00",	"KES 10,850.00"
Kiambu,	Thika Town,	Boma Yangu Thika Kings Orchid Estate,	Ongoing,,	2 Bedroom Standard,	Sold Out,	"KES 3,474,500.00",	"KES 24,300.00"
Kiambu,	Thika Town,	Boma Yangu Thika Kings Orchid Estate,	Ongoing,,	2 Bedroom Master Ensuite,	Sold Out,	"KES 4,085,000.00",	"KES 36,150.00"
Kiambu,	Thika Town,	Boma Yangu Thika Kings Orchid Estate,	Ongoing,,	3 Bedroom Master Ensuite,	Sold Out,	"KES 4,806,500.00",	"KES 42,574.00"

Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,249.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,749.00"
Kiambu,	Kabete,	Boma Yangu Kabete Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kiambu,	Thika Town,	Boma Yangu Thika UTI Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	Studio,	Sold Out,	"KES 1,250,000.00", ""	
Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	1 Bedroom,	Sold Out,	"KES 1,500,000.00", ""	
Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	2 Bedroom Small,	Sold Out,	"KES 2,000,000.00", ""	
Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	2 Bedroom Standard,	Sold Out,	"KES 3,392,000.00", ""	
Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	2 Bedroom Large,	Sold Out,	"KES 3,975,000.00", ""	
Kiambu,	Ruiru,	Kings Boma Estate,	Ongoing,,	3 Bedroom, 	Sold Out,	"KES 4,505,000.00",	""

Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 360,000.00",	"KES 31,750.00"
Kiambu,	Kiambu,	Boma Yangu Ndarugo Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Kiambu,	Thika,	Boma Yangu Thika Bustani Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,200,000.00",	"KES 23,128.00"
Kiambu,	Limuru,	Boma Yangu Limuru Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 5,160,000.00",	"KES 45,500.00"

Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00", "KES 14,450.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Nyandarua,	Nyandarua Town,	Boma Yangu Ol Kalau Estate,	Ongoing,,	3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Nyandarua,	Ol Kalau,	Bama Yangu Nyandarua NHC Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,400,000.00",	"KES 10,120.00"
Nyandarua,	Ol Kalau,	Bama Yangu Nyandarua NHC Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 2,150,000.00",	"KES 15,532.00"
Nyandarua,	Ol Kalau,	Bama Yangu Nyandarua NHC Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 3,200,000.00",	"KES 23,130.00"

Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,793.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Nyandarua,	Engineer,	Boma Yangu Kinangop Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,745.00"

Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,960,000.00",	"KES 31,750.00"
Siaya,	Siaya Town,	Boma Yangu Alego Usonga Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 5,160,000.00",	"KES 45,500.00"

Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kidiwa Phase 2 Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		1 Bedroom Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		2 Bedroom Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 11,300.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 22,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Kapsuswa Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"

Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Pioneer Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00" 
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Uasin Gishu,	Eldoret,	Boma Yangu Eldoret Railway City Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 960,000.00",	"KES 7,600.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Uasin Gishu,	Eldoret City,	Boma Yangu Kimumu Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,960,000.00", "KES 31,750.00"
Kericho,	Kericho Town,	Boma Yangu Talai Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 5,160,000.00",	"KES 45,500.00"

Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kilifi,	Mtwapa,	Boma Yangu Mtwapa City Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800.00",	"KES 42,320.00"

Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kilifi,	Tezo Town,	Boma Yangu Tezo Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 5,400,000.00",	"KES 47,610.00"

Kilifi,	Mtwapa,	Seven Star Apartments Mtwapa,	Ongoing,,	Studio Unit,	Sold Out,	"KES 1,250,000.00", "#"	
Kilifi,	Mtwapa,	Seven Star Apartments Mtwapa,	Ongoing,,	1 Bedroom Unit,	Sold Out,	"KES 2,000,000.00",	"#"
Kilifi,	Mtwapa,	Seven Star Apartments Mtwapa,	Ongoing,,	2 Bedroom Unit,	Sold Out,	"KES 3,000,000.00",	"#"
Kilifi,	Mtwapa,	Seven Star Apartments Mtwapa,	Ongoing,,	4 Bedroom Unit,	Sold Out,	"KES 4,000,000.00",	"#"

Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Samburu,	Maralal,	Boma Yangu Maralal Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00" 

Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		3 Room Social,	Available,	"KES 128,000.00",	"KES 6,800.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kisumu,	Kisumu,	Boma Yangu Lumumba Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kisumu,	Kisumu,	Boma Yangu Upper Kanyakwar Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kisumu,	Kisumu,	Boma Yangu Upper Kanyakwar Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Kisumu,	Kisumu,	Boma Yangu Upper Kanyakwar Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kisumu,	Kisumu,	Boma Yangu Upper Kanyakwar Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Busia,	Funyula,	Boma Yangu Funyula Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Busia,	Matayos,	Boma Yangu Nasewa Industrial Park Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		2 Bedroom Unit Affordable, 	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Busia,	Busia Town,	Boma Yangu Busia ATC Phase 2 Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 41,320.00"

Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Busia,	Busia,	Boma Yangu Busia ATC Phase 1 Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Kwale,	Matuga,	Boma Yangu Matuga Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,794.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Kwale,	Msambweni,	Boma Yangu Diani 'White House' Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00" 

Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		2 Bedroom Unit Affordable, Available, 	"KES 2,000,000.00",	"KES 14,450.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		3 Bedroom Unit Affordable, Available, 	"KES 3,000,000.00",	"KES 21,685.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		2 Bedroom Unit Market, Available, 	"KES 3,600,000.00",	"KES 31,750.00"
Laikipia,	Nyahururu,	Boma Yangu Nyahururu,	Ongoing,,		3 Bedroom Unit Market, Available, 	"KES 4,800,000.00",	"KES 42,320.00"

Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,246.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 10,844.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,, 	2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Laikipia,	Nanyuki,	Boma Yangu Nanyuki Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kisii,	Nyaribari Masaba,	Boma Yangu Nyaribari Masaba Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kisii,	Ogembo,	Boma Yangu Ogembo Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Kisii,	Kisii,	Boma Yangu Nyanchwa Estate	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 41,320.00"

Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Narok,	Kilgoris Town,	Boma Yangu Kilgoris Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Kajiado, Rongai,	Boma Yangu Kings Serenity Estate,	Completed,, 2 Bedroom Unit,	Sold Out,	"KES 3,800,000.00","#"

Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,226.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,749.00"
Kajiado,	Gataka - Ongata Rongai,	Boma Yangu Gataka Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00", "#"	
Kajiado,	Ngong,	Boma Yangu Ngong Vet Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,400.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 4,320,000.00",	"KES 31,300.00"
Kajiado,	Kajiado,	Boma Yangu Kajiado Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Bungoma,	Kanduyi,	Boma Yangu Kanduyi Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 15,600.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Bungoma,	Bungoma,	Bungoma Affordable Housing Project,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Tharaka Nithi,	Chuka,	Boma Yangu Chuka PW Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Trans Nzoia,	Kitale,	Boma Yangu Maili Tatu Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,	1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 10,850.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Migori,	Mabera,	Boma Yangu Mabera Estate (Phase 1),	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	KES 7,249.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	KES 3,900.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	KES 5,350.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	KES 6,800.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	KES 14,450.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	KES 21,680.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	KES 31,749.00"
Migori,	Kehancha Town,	Boma Yangu Kehancha Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	KES 42,320.00"

Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,685.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Migori,	Rongo,	Boma Yangu Rongo Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Machakos,	Machakos Town,	Boma Yangu Machakos Civil Servants Estate,	Completed,,		2 Bedroom Unit Market,	Sold Out,	"KES 3,960,000.00", "#"	
Machakos,	Machakos Town,	Boma Yangu Machakos Civil Servants Estate,	Completed,,		3 Bedroom Unit Market,	Sold Out,	"KES 5,160,000.00",	"#"

Machakos,	Athi River Town,	Moke Gardens Affordable Housing Development,	Ongoing,,	Studio Unit,	Available,	"KES 1,500,000.00", "#"	
Machakos,	Athi River Town,	Moke Gardens Affordable Housing Development,	Ongoing,,		1 Bedroom Unit,	Available,	"KES 2,750,000.00", "#" 	
Machakos,	Athi River Town,	Moke Gardens Affordable Housing Development,	Ongoing,,		2 Bedroom Unit,	Available,	"KES 4,400,000.00", "#"	
Machakos,	Athi River Town,	Moke Gardens Affordable Housing Development,	Ongoing,,		3 Bedroom Unit,	Available,	"KES 5,705,000.00", "#"	

Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,249.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Machakos,	Machakos Town,	Boma Yangu Konza City Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Machakos,	Mavoko,	Boma Yangu Mavoko Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,981,200.00",	"KES 11,300.00"
Machakos,	Mavoko,	Boma Yangu Mavoko Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 3,598,400.00",	"KES 20,500.00"
Machakos,	Mavoko,	Boma Yangu Mavoko Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 4,622,800.00",	"KES 26,330.00"

Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 10,850.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Machakos,	Machakos,	Boma Yangu Machakos Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Makueni,	Wote,	Boma Yangu Wote Pool Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Mombasa, 	Nyali,	Boma Yangu Nyali (VoK) Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,	1 Bedroom Unit G-5th Floor,	Sold Out,	"KES 2,900,000.00",	"#" 
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		1 Bedroom Unit 6th-10th Floor,	Sold Out,	"KES 3,000,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		1 Bedroom Unit 11th-15th Floor,	Sold Out,	"KES 3,100,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		2 Bedroom Unit G-5th Floor,	Sold Out,	"KES 4,400,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		2 Bedroom Unit 6th-10th Floor,	Sold Out,	"KES 4,500,000.00", "#"	
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		2 Bedroom Unit 11th-15th Floor,	Sold Out,	"KES 4,600,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		3 Bedroom Unit G-5th Floor,	Sold Out,	"KES 5,900,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		3 Bedroom Unit 6th-10th Floor,	Sold Out,	"KES 6,000,000.00",	"#"
Mombasa, 	Mvita Constituency, Tononoka Ward	Buxton Point,	Ongoing,,		3 Bedroom Unit 11th-15th Floor,	Sold Out,	"KES 6,100,000.00",	"#"

Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Murang'a,	Makuyu,	Boma Yangu Makuyu Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,350.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"
Murang'a,	Kenol,	Boma Yangu Gatanga Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 42,320.00"

Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,246.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,795.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Murang'a,	Makenji,	Boma Yangu Makenji Estate,	Ongoing,  	3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,900.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,250.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 14,450.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 21,680.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 21,160.00"
Kirinyaga,	Gichugu,	Boma Yangu Gichugu Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 31,750.00"

Kirinyaga,	Kerugoya,	Boma Yangu Kirinyaga NHC Estate,	Ongoing,,		Studio Unit, Available,	"KES 1,400,000.00",	"KES 10,120.00"
Kirinyaga,	Kerugoya,	Boma Yangu Kirinyaga NHC Estate,	Ongoing,,		Studio Unit Cum Shop,	Available,	"KES 320,000.00",	"KES 23,130.00"
Kirinyaga,	Kerugoya,	Boma Yangu Kirinyaga NHC Estate,	Ongoing,,		1 Bedroom Unit, Available,	"KES 2,150,000.00",	"KES 15,540.00"
Kirinyaga,	Kerugoya,	Boma Yangu Kirinyaga NHC Estate,	Ongoing,,		2 Bedroom Unit,	Available,	"KES 3,200,000.00",	"KES 23,130.00"

Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,	Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00"
Garissa,	Garissa Town,	Boma Yangu Garissa Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		Studio Unit Social,	Available,	"KES 896,000.00",	"KES 5,040.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,400,000.00",	"KES 10,118.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		Studio Cum Shop Affordable,	Available,	"KES 3,200,000.00",	"KES 23,128.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		Studio Cum Shop Market, 	Available,	"KES 3,840,000.00",	"KES 33,856.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		1 Bedroom Unit Social,	Available,	"KES 1,376,000.00",	"KES 7,203.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 2,150,000.00",	"KES 15,539.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 3,200,000.00",	"KES 23,128.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		1 Bedroom Unit Market,	Available,	"KES 2,580,000.00",	"KES 22,748.00"
Homa Bay,	Homa Bay,	Boma Yangu Homa Bay Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,840,000.00",	"KES 33,856.00"

Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,	 	Studio Unit Social,	Available,	 KES 1,000,000.00",	"KES 7,600.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		1 Room Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		2 Room Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		3 Room Social,	Available,	"KES 1,280,000.00",	"KES 6,500.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00" 
Kitui,	Kitui Town,	Boma Yangu Kwa Ngendu Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 4,800,000.00",	"KES 44,300.00"

Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,	Studio Unit Social,	Available,	"KES 640,000.00",	"KES 3,800.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		Studio Unit Affordable,	Available,	"KES 1,000,000.00",	"KES 7,600.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		1 Bedroom Unit Social,	Available,	"KES 960,000.00",	"KES 5,200.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		2 Bedroom Unit Social,	Available,	"KES 1,280,000.00",	"KES 6,800.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		1 Bedroom Unit Affordable,	Available,	"KES 1,500,000.00",	"KES 8,500.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		2 Bedroom Unit Affordable,	Available,	"KES 2,000,000.00",	"KES 15,100.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		3 Bedroom Unit Affordable,	Available,	"KES 3,000,000.00",	"KES 22,600.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		2 Bedroom Unit Market,	Available,	"KES 2,400,000.00",	"KES 22,200.00"
Isiolo,	Isiolo Township Ward,	Boma Yangu Isiolo Township Estate,	Ongoing,,		3 Bedroom Unit Market,	Available,	"KES 3,600,000.00",	"KES 33,200.00" 

Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, Studio Unit Social, Available, "KES 640,000.00", "KES 3,800.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 1 Bedroom Unit Social, Available, "KES 960,000.00", "KES 5,200.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 2 Bedroom Unit Social, Available, "KES 1,280,000.00", "KES 6,500.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 1 Bedroom Unit Affordable, Available, "KES 1,500,000.00", "KES 11,300.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 2 Bedroom Unit Market, Available, "KES 2,400,000.00", "KES 22,200.00"
Bomet, Chepalungu, Boma Yangu Chepalungu Estate, Ongoing,, 3 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"

Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, Studio Unit Social, Available, "KES 640,000.00", "KES 3,800.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, Studio Unit Affordable, Available, "KES 1,000,000.00", "KES 7,600.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 1 Bedroom Unit Social, Available, "KES 960,000.00", "KES 5,200.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 2 Bedroom Unit Social, Available, "KES 1,280,000.00", "KES 6,500.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 1 Bedroom Unit Affordable, Available, "KES 1,500,000.00", "KES 11,300.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 2 Bedroom Unit Affordable, Available, "KES 2,000,000.00", "KES 15,100.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 3 Bedroom Unit Affordable, Available, "KES 3,000,000.00", "KES 22,600.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 2 Bedroom Unit Market, Available, "KES 2,400,000.00", "KES 22,200.00"
Wajir, Wajir Township, Boma Yangu Wajir township (Skanska), Ongoing,, 3 Bedroom Unit Market, Available, "KES 3,600,000.00", "KES 33,200.00"`;
