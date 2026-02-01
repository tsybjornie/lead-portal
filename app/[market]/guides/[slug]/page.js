'use client';

import Link from 'next/link';
import { use } from 'react';

import { useMarket } from '../../../../context/MarketContext';

export default function GuidePage({ params }) {
    const { slug } = use(params);
    const { market } = useMarket();

    // Helper component for visual bullet lists
    const BulletList = ({ items, type = 'check' }) => {
        const icon = type === 'check' ? '✓' : type === 'cross' ? '✗' : '→';
        const color = type === 'check' ? '#2d5f2e' : type === 'cross' ? '#8b3a3a' : 'var(--accent)';

        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
                {items.map((item, i) => (
                    <li key={i} style={{
                        padding: '0.75rem 0',
                        paddingLeft: '2rem',
                        position: 'relative',
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        borderBottom: i < items.length - 1 ? '1px solid var(--bg-light)' : 'none'
                    }}>
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            top: '0.75rem',
                            color: color,
                            fontWeight: 600,
                            fontSize: '1.2rem'
                        }}>{icon}</span>
                        {item}
                    </li>
                ))}
            </ul>
        );
    };

    // Helper for highlighted info boxes
    const InfoBox = ({ title, children, type = 'info' }) => {
        const colors = {
            info: { bg: '#e8f4f8', border: '#5ba4cf', icon: 'ℹ️' },
            warning: { bg: '#fff4e6', border: '#e67700', icon: '⚠️' },
            tip: { bg: '#e8f8e8', border: '#4a9b4a', icon: '💡' }
        };
        const style = colors[type];

        return (
            <div style={{
                background: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: '0',
                padding: '1.5rem',
                margin: '2rem 0'
            }}>
                <div style={{
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>{style.icon}</span>
                    {title}
                </div>
                <div style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                    {children}
                </div>
            </div>
        );
    };

    const guides = {
        'design-vs-build': {
            title: 'Design vs Build in Singapore',
            category: 'Planning',
            sections: [
                {
                    heading: 'What is Design-Build?',
                    type: 'text',
                    content: 'Design-build is a project delivery method where a single entity handles both design and construction phases of your renovation.'
                },
                {
                    heading: 'Quick Comparison',
                    type: 'comparison',
                    designBuild: [
                        'One contract, one point of contact',
                        'Faster project delivery',
                        'Streamlined communication',
                        'Single accountability',
                        'Common in Singapore HDB/condo renovations'
                    ],
                    traditional: [
                        'Separate designer and contractor contracts',
                        'Designer supervises contractor',
                        'More control over contractor selection',
                        'Checks and balances built in',
                        'Better for complex/specialized projects'
                    ]
                },
                {
                    heading: 'When Design-Build Makes Sense',
                    type: 'bullets',
                    items: [
                        'You value convenience and streamlined communication',
                        'You want a single accountable party',
                        'You prefer faster project delivery',
                        'You don\'t want to manage multiple contracts',
                        'Standard HDB or condo renovation'
                    ]
                },
                {
                    heading: 'Cost Implications',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Key Insight',
                    content: 'Design-build doesn\'t inherently cost more or less—it\'s a delivery method, not a pricing structure. It can reduce change orders and delays (saving money), but may limit competitive bidding for construction. Always ask for detailed breakdowns of design fees versus build costs.'
                }
            ]
        },
        'hdb-renovation-rules': {
            title: 'HDB Renovation Rules',
            category: 'Regulatory',
            sections: [
                {
                    heading: 'Required Approvals',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: 'Before You Start',
                    content: 'You MUST apply for approval from HDB before starting any renovation work. Submit a Renovation Application through the HDB portal and wait for approval. Starting work without approval = fines + order to reinstate your flat.'
                },
                {
                    heading: 'What You CANNOT Do',
                    type: 'bullets-cross',
                    items: [
                        'Remove structural walls or walls enclosing bathroom/kitchen/bomb shelter',
                        'Hack tiles or walls in enclosed areas without approval',
                        'Alter windows, grilles, or exterior facade',
                        'Install fixtures on external walls without approval'
                    ]
                },
                {
                    heading: 'What You CAN Do Freely',
                    type: 'bullets-check',
                    items: [
                        'Paint walls',
                        'Install non-structural built-in furniture',
                        'Replace flooring (without hacking screed)',
                        'Make cosmetic changes (no hacking/structural work)',
                        'Install/replace kitchen cabinets and wardrobes (no hacking involved)'
                    ]
                },
                {
                    heading: 'Renovation Timing Rules',
                    type: 'infobox',
                    boxType: 'info',
                    boxTitle: 'Allowed Hours',
                    content: 'Weekdays and Saturdays only: 9am to 6pm. No noisy renovation work on Sundays and public holidays. Violations can result in complaints and fines. Be considerate of your neighbors!'
                },
                {
                    heading: 'Licensed Contractors Required For',
                    type: 'bullets',
                    items: [
                        'Electrical rewiring',
                        'Plumbing modifications',
                        'Structural hacking',
                        'Works requiring BCA-registered contractor'
                    ]
                }
            ]
        },
        'condo-mcst-approvals': {
            title: 'Condo & MCST Renovation Approvals',
            category: 'Regulatory',
            sections: [
                {
                    heading: 'What is MCST?',
                    type: 'text',
                    content: 'Management Corporation Strata Title (MCST) manages your condo\'s common property and enforces by-laws. They approve renovations that may affect common property, structure, or other residents.'
                },
                {
                    heading: 'Approval Requirements',
                    type: 'bullets',
                    items: [
                        'Submit application to MCST (through managing agent)',
                        'Provide renovation plans and contractor details',
                        'Pay security deposit ($5,000 to $20,000 typical)',
                        'Prove public liability insurance coverage',
                        'Wait for approval (few days to several weeks)'
                    ]
                },
                {
                    heading: 'Common Restrictions',
                    type: 'bullets-cross',
                    items: [
                        'No changes to external facades, balconies, or windows',
                        'Wall removal may need structural engineer certification',
                        'Renovation hours restricted (weekdays + Saturday mornings typical)',
                        'Waterproofing requires warranties (leaks affect units below)'
                    ]
                },
                {
                    heading: 'Getting Your Deposit Back',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Pro Tip',
                    content: 'Document common areas with photos BEFORE starting work. MCST inspects corridors, lifts, and lobbies after completion. No damage = full refund. Any damage = deducted from deposit.'
                }
            ]
        },
        'licensed-contractor-required': {
            title: 'When a Licensed Main Contractor Is Required',
            category: 'Regulatory',
            sections: [
                {
                    heading: 'Legal Battle Cry',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: 'This Is The Law',
                    content: 'Under Singapore\'s Building Control Act, certain renovation work can ONLY be done by BCA-licensed contractors. Using unlicensed contractors = illegal = fines for contractor AND homeowner.'
                },
                {
                    heading: 'Licensed Contractor REQUIRED For',
                    type: 'bullets',
                    items: [
                        'Structural works (removing/altering walls, beams, columns, slabs)',
                        'Hacking walls (even non-structural partition walls)',
                        'General building works (masonry, plastering, floor screeding)',
                        'Electrical work involving main distribution board or permanent wiring',
                        'Plumbing modifications (water supply or sanitary systems)'
                    ]
                },
                {
                    heading: 'License NOT Required For',
                    type: 'bullets-check',
                    items: [
                        'Painting and wallpapering',
                        'Installing loose furniture',
                        'Replacing light fixtures (no rewiring)',
                        'Laying flooring without hacking'
                    ]
                },
                {
                    heading: 'How to Verify Contractor License',
                    type: 'bullets',
                    items: [
                        'Check BCA license on BCA website',
                        'Verify license class (CW01, CW02, etc.) covers your scope of work',
                        'Ask for copy of license',
                        'Ensure registered business name matches contractor you\'re engaging'
                    ]
                }
            ]
        },
        'why-quotes-vary': {
            title: 'Why Renovation Quotes Vary',
            category: 'Planning',
            sections: [
                {
                    heading: 'Scope & Specifications',
                    type: 'text',
                    content: 'The biggest factor: What\'s actually included? One quote may include premium finishes, another assumes basic work. Always request detailed breakdowns to compare like-for-like.'
                },
                {
                    heading: 'Key Factors That Affect Pricing',
                    type: 'bullets',
                    items: [
                        'Materials: Laminate vs solid surface, ceramic vs porcelain tiles',
                        'Firm overhead: Showrooms, insurance, experienced staff = higher cost',
                        'Design services: 3D renders, revisions, on-site supervision',
                        'Project management: Site supervision, coordination, defect rectification',
                        'Hidden contingencies: Some pad quotes, others charge extras later'
                    ]
                },
                {
                    heading: 'Questions to Ask',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Before You Sign',
                    content: 'What design services are included? How many revisions are permitted? Who supervises the work? What happens if unexpected issues arise (concealed piping, structural surprises)? How are variations priced?'
                },
                {
                    heading: 'What You\'re Really Paying For',
                    type: 'bullets',
                    items: [
                        'Reliability and accountability (not just labor)',
                        'Proper licensing and insurance',
                        'Track record and references',
                        'Peace of mind vs personal project management'
                    ]
                }
            ]
        },
        'renovation-budget-guide-2025': {
            title: market === 'JB' ? 'Johor Renovation Budget Guide 2025' : 'Renovation Budget Guide 2025',
            category: 'Planning',
            sections: market === 'JB' ? [
                {
                    heading: 'Market Rates (Estimated in RM)',
                    type: 'comparison',
                    designBuild: [
                        'Terrace House (22x70): RM 80,000 - RM 150,000',
                        'Semi-D: RM 150,000 - RM 250,000',
                        'Bungalow: RM 300,000+',
                        'Condo/Serviced Apt (New): RM 40,000 - RM 70,000',
                        'Condo (Resale/Re-tiling): RM 80,000+'
                    ],
                    traditional: [
                        'Contractor (Labor Only): 30% cheaper',
                        'Interior Designer (Turnkey): Add 20-30%',
                        'Direct Factory (Carpentry): RM 450-600 pfr'
                    ]
                },
                {
                    heading: 'Cost Drivers in Johor',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: 'Exchange Rate Factor',
                    content: 'Many materials (tiles, fittings) are imported. A weak Ringgit means material costs are high, even if labor is cheaper than Singapore. Always asking if the quota for foreign workers is affecting your contractor\'s timeline.'
                },
                {
                    heading: 'Where Your Money Goes',
                    type: 'bullets',
                    items: [
                        'Carpentry: 35% (Kitchen & Wardrobes)',
                        'Wet Works (Extension/Tiling): 30% (High for landed extensions)',
                        'Wiring & Plumbing: 15%',
                        'Ceiling (Plaster Ceiling): 10%',
                        'Gate & Grille: 10% (Essential in Malaysia)'
                    ]
                }
            ] : [
                {
                    heading: 'Market Rates (Estimated)',
                    type: 'comparison',
                    designBuild: [
                        '3-Room HDB (New): $35,000 - $50,000',
                        '4-Room HDB (New): $42,000 - $60,000',
                        '5-Room HDB (New): $50,000 - $70,000',
                        'Condo (New, Minor Work): $25,000 - $45,000',
                        'Landed (A&A): $200,000+'
                    ],
                    traditional: [
                        '3-Room HDB (Resale): $50,000 - $75,000',
                        '4-Room HDB (Resale): $65,000 - $90,000',
                        '5-Room HDB (Resale): $80,000 - $110,000',
                        'Condo (Resale, Full Gut): $70,000 - $120,000',
                        'Landed (Reconstruction): $400,000+'
                    ]
                },
                {
                    heading: 'Inflation Reality Check',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: '2025 Cost Drivers',
                    content: 'Labor costs have risen ~15% since 2023 due to tighter foreign worker quotas. Material costs (especially tiles and carpentry) have stabilized but remain high. Budget an extra 10-15% buffer for unforeseen issues.'
                },
                {
                    heading: 'Where Your Money Goes',
                    type: 'bullets',
                    items: [
                        'Carpentry: 30-40% (Most expensive component)',
                        'Wet Works (Tiling/Hacking): 20-25%',
                        'Electrical & Plumbing: 10-15%',
                        'Painting & Ceiling: 5-10%',
                        'Preliminaries (Protection, Haulage, Cleaning): 5%'
                    ]
                }
            ]
        },
        'tiling-flooring-guide': {
            title: 'Tiling & Flooring 101',
            category: 'Technical',
            sections: [
                {
                    heading: 'Vinyl vs. Tiles',
                    type: 'comparison',
                    designBuild: market === 'JB' ? [
                        'Cheaper (RM 6 - RM 12 psf)',
                        'Overlay over existing tiles',
                        'Softer underfoot',
                        'Not waterproof (water resistant only)',
                        'Scratch adjacent'
                    ] : [
                        'Cheaper ($4-$7 psf)',
                        'Overlay over existing tiles',
                        'Softer underfoot',
                        'Not waterproof (water resistant only)',
                        'Scratch adjacent'
                    ],
                    traditional: market === 'JB' ? [
                        'More expensive (RM 25 - RM 45+ psf)',
                        'Requires hacking (or messy wet overlay)',
                        'Hard & cold feel',
                        'Fully waterproof & durable',
                        'Long-lasting (20+ years)'
                    ] : [
                        'More expensive ($9-$15+ psf)',
                        'Requires hacking (or messy wet overlay)',
                        'Hard & cold feel',
                        'Fully waterproof & durable',
                        'Long-lasting (20+ years)'
                    ]
                },
                {
                    heading: 'Regulations (HDB vs Landed)',
                    type: 'infobox',
                    boxType: 'info',
                    boxTitle: market === 'JB' ? 'Structure Matters' : 'HDB & Weight',
                    content: market === 'JB'
                        ? 'For landed properties, ground floor tiling usually needs a solid concrete base to prevent "popping" tiles due to ground movement. For condos, ensure your contractor applies for management approval for hacking.'
                        : 'If you choose to overlay tiles on top of existing tiles, HDB has strict weight limits. You can usually only overlay ONCE. If the floor has already been overlaid before, you MUST hack everything up.'
                },
                {
                    heading: 'Common Mistakes',
                    type: 'bullets-cross',
                    items: [
                        'Using glossy tiles in bathrooms (Slippery hazard)',
                        'Using vinyl in wet kitchens or bathrooms (Will warp/mold)',
                        'Forgetting to buy extra tiles for wastage (Buy 10% extra)',
                        'Not checking allowablility of marble/granite (staining issues)'
                    ]
                }
            ]
        },
        'electrical-planning-guide': {
            title: 'Lighting & Electrical Planning',
            category: 'Technical',
            sections: [
                {
                    heading: 'Lighting Types',
                    type: 'bullets',
                    items: [
                        'Ambient: General light (Downlights, Ceiling Flush Mounts)',
                        'Task: Focused light (Under-cabinet strip, Reading lamps)',
                        'Accent: Mood light (Cove lighting, Spotlights on Art)'
                    ]
                },
                {
                    heading: 'Color Temperature Guide',
                    type: 'text',
                    content: '3000K (Warm White) for bedrooms and living areas (relaxing). 4000K (Cool White) for kitchens, bathrooms, and study areas (working). 6000K (Daylight) is clinically bright and usually avoided in premium residential design.'
                },
                {
                    heading: 'Power Socket Strategy',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Don\'t Skimp Here',
                    content: 'Plan for more sockets than you think you need. Key spots often missed: Beside the sofa (phone charging), inside the pantry cabinet (appliances), beside the bed (both sides), and at the vacuum cleaner charging station.'
                }
            ]
        },
        'carpentry-guide': {
            title: 'Carpentry: The Expensive Part',
            category: 'Materials',
            sections: [
                {
                    heading: 'Internal Carcass (The Body)',
                    type: 'text',
                    content: 'Standard is Colour PVC. Upgraded is Internal Laminate (looks nicer, easier to clean). Avoid white PVC if possible as it yellows over time; go for grey or woodgrain PVC.'
                },
                {
                    heading: 'Hinges & Runners (The Movement)',
                    type: 'comparison',
                    designBuild: [
                        'Excel / Casarredo (Budget)',
                        'Standard Soft Close',
                        'Good for rental',
                        'Generic warranty'
                    ],
                    traditional: [
                        'Blum / Hettich (Premium)',
                        'Silky smooth motion',
                        'Lifetime warranty',
                        'Higher load bearing'
                    ]
                },
                {
                    heading: 'Formaldehyde Emission',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: 'Health Safety',
                    content: 'Ask for low-formaldehyde plywood (Super E0 or E0 grade), especially for children\'s rooms. Standard plywood can off-gas VOCs for years, affecting indoor air quality.'
                }
            ]
        },
        'wet-works-guide': {
            title: 'Wet Works & Waterproofing',
            category: 'Technical',
            sections: [
                {
                    heading: 'The Critical Steps',
                    type: 'bullets',
                    items: [
                        'Waterproofing Membrane: Applied after hacking floor',
                        'Ponding Test: Flooding the toilet for 24-48 hours',
                        'Screeding: Creating the slope to drain',
                        'Tiling: Laying the finish'
                    ]
                },
                {
                    heading: 'Why Bathrooms Leak',
                    type: 'bullets-cross',
                    items: [
                        'Rushing the water-ponding test',
                        'Damaging the membrane during piping work',
                        'Insufficient slope (water stagnates)',
                        'Grout deterioration over time'
                    ]
                },
                {
                    heading: 'HDB Limitations',
                    type: 'infobox',
                    boxType: 'info',
                    boxTitle: 'The 3-Year Ban',
                    content: 'In new BTO flats, you CANNOT hack the bathroom wall or floor tiles for the first 3 years. This is to protect the waterproofing warranty provided by HDB\'s building contractor.'
                }
            ]
        },
        'defects-inspection-checklist': {
            title: 'Defects Inspection Checklist',
            category: 'Handover',
            sections: [
                {
                    heading: 'Don\'t Pay The Final 5-10% Yet',
                    type: 'text',
                    content: 'Once you make the final payment, your leverage is gone. Perform a thorough defects check 1-2 weeks before the promised handover date.'
                },
                {
                    heading: 'The Checklist',
                    type: 'bullets-check',
                    items: [
                        'Carpentry: Doors align, drawers slide smooth, no sharp edges',
                        'Tiling: Tap tiles with coin (hollow sound = air pocket = potential crack)',
                        'Plumbing: Turn on all taps, check under sinks for drips',
                        'Electrical: Test every socket with a phone charger',
                        'Paint: Check for patchiness under bright light',
                        'Glass: Check for scratches on mirrors and shower screens'
                    ]
                },
                {
                    heading: 'Rectification Timeline',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Be Reasonable',
                    content: 'Minor touch-ups (paint, silicone) take days. Major rectifications (replacing a scratched glass panel or hollow tiles) can take weeks. Agree on a timeline for fixes before moving your furniture in.'
                }
            ]
        },
        'contract-red-flags': {
            title: 'Renovation Contract Red Flags',
            category: 'Planning',
            sections: [
                {
                    heading: 'Payment Terms',
                    type: 'infobox',
                    boxType: 'warning',
                    boxTitle: 'Dangerous Structure',
                    content: 'NEVER agree to: 50% deposit, or 90% payment before carpentry installation. A fair structure: 10-20% Deposit, 30-40% Wet Works, 25-30% Carpentry/Delivery, 10-15% Handover.'
                },
                {
                    heading: 'Vague Descriptions',
                    type: 'comparison',
                    designBuild: [
                        '"Supply and install kitchen cabinet"',
                        '"Painting of whole house"',
                        '"Install lights"',
                        '(Too vague - allows use of cheap materials)'
                    ],
                    traditional: [
                        '"Supply and install 20ft kitchen cabinet in internal laminate finish with Blum soft-close hinges and 3 drawers"',
                        '"Painting using Nippon Vinilex 5000 (4 colors)"',
                        '"Install 10x light points (Lighting fixtures provided by owner)"'
                    ]
                },
                {
                    heading: market === 'JB' ? 'Missing SST Info' : 'Missing GST Info',
                    type: 'text',
                    content: market === 'JB'
                        ? 'Is the price inclusive of SST (8%)? Most smaller contractors are not SST registered (verify their registration number). If they charge SST but have no license, it is illegal.'
                        : 'Is the price "before GST" or "inclusive of GST"? This adds 9% to your final bill. Ensure it is clearly stated.'
                }
            ]
        },
        'buying-property-jb-guide': {
            title: 'Singaporean Guide to Buying in JB',
            category: 'Planning',
            sections: [
                {
                    heading: 'Foreigner Buying Thresholds',
                    type: 'infobox',
                    boxType: 'info',
                    boxTitle: 'The RM 1 Million Unit',
                    content: 'In Johor, foreigners can generally only buy properties valued above RM 1 Million. However, there are exceptions for Medini zone (no minimum threshold) and certain MM2H participants.'
                },
                {
                    heading: 'Process Overview',
                    type: 'bullets',
                    items: [
                        'Pay Earnest Deposit (2-3%)',
                        'Apply for State Consent (Levy applies, usually 2% of price or RM20k)',
                        'Sign SPA (Sales & Purchase Agreement)',
                        'Pay Balance Downpayment (Total 10%)',
                        'Completion (3+1 months typically)'
                    ]
                },
                {
                    heading: 'Hidden Costs',
                    type: 'comparison',
                    designBuild: [
                        'State Consent Levy',
                        'Legal Fees (Scale fees)',
                        'Stamp Duty (MOT)',
                        'Valuation Fees'
                    ],
                    traditional: [
                        'Agent Fees (Buyer usually doesn\'t pay for private property, but confirm)',
                        'Conversion logic (SGD strength is your friend)'
                    ]
                }
            ]
        },
        'jb-renovation-permits': {
            title: 'Johor Renovation Permits (MBJB/MBIP)',
            category: 'Regulatory',
            sections: [
                {
                    heading: 'Does My Reno Need a Permit?',
                    type: 'text',
                    content: 'Unlike Singapore where HDB approves everything, in Johor, your local council (Majlis Bandaraya Johor Bahru - MBJB, or Iskandar Puteri - MBIP) governs approvals. You need a permit for any EXTENSION, structural change, or facade alteration.'
                },
                {
                    heading: 'The "Pelan" Process',
                    type: 'bullets-check',
                    items: [
                        'Hire a Registered Draughtsman (Pelukis Pelan)',
                        'Submit plans to Majlis',
                        'Pay deposit (Wang Cagaran) + Processing Fee',
                        'Place "Bin" (Tong Sampah) deposit for debris collection'
                    ]
                },
                {
                    heading: 'Common Illegal Works',
                    type: 'bullets-cross',
                    items: [
                        'Extending kitchen fully to the back boundary (Need set back)',
                        'Building a balcony over the car porch without approval',
                        'Changing the front gate design beyond allowed height'
                    ]
                },
                {
                    heading: 'Getting Deposit Back',
                    type: 'infobox',
                    boxType: 'tip',
                    boxTitle: 'Claiming Wang Cagaran',
                    content: 'After renovation, you must submit "Borang F" (Certificate of Completion and Compliance equivalent for reno) and photos to claim your deposit back. Many owners forget this step!'
                }
            ]
        },
        'kitchen-countertop-guide': {
            title: 'Kitchen Countertops: Quartz vs Sintered Stone',
            category: 'Materials',
            sections: [
                {
                    heading: 'Battle of the Stones',
                    type: 'comparison',
                    designBuild: [
                        '**Quartz**',
                        'Resin + Stone dust',
                        'Stain resistant (mostly)',
                        'Cannot take hot pans (Resin burns)',
                        market === 'JB' ? 'Cheaper (RM 180 - RM 300 pfr)' : 'Cheaper ($80-$150 pfr)'
                    ],
                    traditional: [
                        '**Sintered Stone (Gardenia/Dekton)**',
                        'Baked mineral stone',
                        'Heat proof (Torch it!)',
                        'Scratch proof',
                        market === 'JB' ? 'Expensive (RM 350 - RM 600+ pfr)' : 'Expensive ($150-$300+ pfr)',
                        'Brittle (Can chip on edges)'
                    ]
                },
                {
                    heading: 'KompacPlus',
                    type: 'text',
                    content: 'A compressed wood/resin material. Very thin (6mm). Stylish wood look, but can scratch and cannot take direct heat. Good for low-cooking zones.'
                },
                {
                    heading: 'Solid Surface (Acrylic)',
                    type: 'text',
                    content: 'Plastic-based. Seamless joints (great for weird shapes). Soft (scratches easily) and melts under heat. Generally considered "budget" or "dated" in 2025 unless used for specific curved designs.'
                }
            ]
        }
    };

    const guide = guides[slug];

    if (!guide) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Guide Not Found</h1>
                    <Link href="/guides" style={{ color: 'var(--accent)' }}>← Back to Guides</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-cream)',
                padding: '3rem 0 2rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <Link href="/guides" style={{
                        color: 'var(--text-light)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'inline-block',
                        marginBottom: '1.5rem'
                    }}>
                        ← Back to Guides
                    </Link>

                    <span style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        marginBottom: '1rem',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
                    }}>
                        {guide.category}
                    </span>

                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        color: 'var(--primary-dark)',
                        fontWeight: 400,
                        lineHeight: 1.3,
                        marginBottom: 0
                    }}>
                        {guide.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{
                maxWidth: '900px',
                padding: '3rem 1.5rem 5rem'
            }}>
                <article>
                    {guide.sections.map((section, index) => (
                        <section key={index} style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                color: 'var(--primary-dark)',
                                marginBottom: '1.5rem',
                                fontWeight: 500
                            }}>
                                {section.heading}
                            </h2>

                            {/* Text content */}
                            {section.type === 'text' && (
                                <p style={{
                                    fontSize: '1.05rem',
                                    lineHeight: 1.8,
                                    color: 'var(--text)'
                                }}>
                                    {section.content}
                                </p>
                            )}

                            {/* Bullet lists */}
                            {section.type === 'bullets' && (
                                <BulletList items={section.items} type="arrow" />
                            )}

                            {section.type === 'bullets-check' && (
                                <BulletList items={section.items} type="check" />
                            )}

                            {section.type === 'bullets-cross' && (
                                <BulletList items={section.items} type="cross" />
                            )}

                            {/* Info boxes */}
                            {section.type === 'infobox' && (
                                <InfoBox title={section.boxTitle} type={section.boxType}>
                                    {section.content}
                                </InfoBox>
                            )}

                            {/* Comparison */}
                            {section.type === 'comparison' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '2rem',
                                    margin: '2rem 0'
                                }}>
                                    <div style={{
                                        background: '#e8f4f8',
                                        border: '2px solid #5ba4cf',
                                        borderRadius: '0',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            color: '#2d5f7e'
                                        }}>Design-Build</h3>
                                        <BulletList items={section.designBuild} type="check" />
                                    </div>
                                    <div style={{
                                        background: '#fff4e6',
                                        border: '2px solid #e67700',
                                        borderRadius: '0',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            color: '#8b5a00'
                                        }}>Traditional (Design-Bid-Build)</h3>
                                        <BulletList items={section.traditional} type="arrow" />
                                    </div>
                                </div>
                            )}
                        </section>
                    ))}
                </article>

                {/* Subtle CTA */}
                <div style={{
                    marginTop: '5rem',
                    padding: '2.5rem',
                    background: 'var(--bg-cream)',
                    border: '1px solid var(--border)',
                    borderRadius: '0',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-light)',
                        marginBottom: '1rem',
                        lineHeight: 1.7
                    }}>
                        Ready to start planning your renovation?
                    </p>
                    <Link
                        href="/style-quiz"
                        style={{
                            display: 'inline-block',
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            borderBottom: '1px solid var(--accent)',
                            paddingBottom: '2px',
                            transition: 'opacity 0.3s'
                        }}
                    >
                        Start with a few questions →
                    </Link>
                </div>
            </div>
        </div>
    );
}
