<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RegistrationField;

class RegistrationFieldSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Helper / Cleaner / Nanny / Housekeeper Journey ──────────────
        $cleaningFields = [
            [
                'label' => 'Primary Service & Specialization',
                'name' => 'cleaning_specialization',
                'type' => 'dropdown',
                'options' => [
                    'Domestic Cleaning & Housekeeping',
                    'Deep Cleaning & Move-in/Move-out',
                    'Nanny & Childcare Services',
                    'Laundry, Ironing & Organization',
                    'Commercial / Office Cleaning',
                    'Elderly Companionship & Care',
                ],
                'is_required' => true,
                'sort_order' => 1,
                'placeholder' => 'Select your main service area',
                'category_name' => 'Cleaning',
            ],
            [
                'label' => 'Live-in / Live-out Availability',
                'name' => 'live_in_preference',
                'type' => 'dropdown',
                'options' => [
                    'Live-out (Daily commuting)',
                    'Live-in (Stay on premises)',
                    'Flexible (Both live-in or live-out)',
                    'Weekends / Part-time only',
                ],
                'is_required' => true,
                'sort_order' => 2,
                'placeholder' => 'Select your arrangement',
                'category_name' => 'Cleaning',
            ],
            [
                'label' => 'Years of Cleaning / Nanny Experience',
                'name' => 'cleaning_experience_years',
                'type' => 'number',
                'options' => null,
                'is_required' => true,
                'sort_order' => 3,
                'placeholder' => 'e.g. 4',
                'category_name' => 'Cleaning',
            ],
            [
                'label' => 'Cooking Ability',
                'name' => 'cooking_ability',
                'type' => 'dropdown',
                'options' => [
                    'Comfortable preparing family meals & baking',
                    'Basic cooking only',
                    'No cooking (Cleaning & laundry only)',
                ],
                'is_required' => false,
                'sort_order' => 4,
                'placeholder' => 'Select cooking skill level',
                'category_name' => 'Cleaning',
            ],
            [
                'label' => 'Police Clearance / Background Check Ready',
                'name' => 'police_clearance_ready',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 5,
                'placeholder' => null,
                'category_name' => 'Cleaning',
            ],
            [
                'label' => 'Childcare / First Aid Certification',
                'name' => 'childcare_certified',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 6,
                'placeholder' => null,
                'category_name' => 'Cleaning',
            ],
        ];

        // ─── 2. Plumber Journey ──────────────────────────────────────────────
        $plumbingFields = [
            [
                'label' => 'Plumbing Trade Specializations',
                'name' => 'plumbing_specialization',
                'type' => 'dropdown',
                'options' => [
                    'Leak Detection & Pipe Repairs',
                    'Geyser Installation & Solar Water Heating',
                    'Drain Unblocking & Sewer Line Maintenance',
                    'Bathroom & Sanitaryware Fitting',
                    'Borehole & Water Tank Pump Connections',
                    'Full Commercial & Industrial Plumbing',
                ],
                'is_required' => true,
                'sort_order' => 1,
                'placeholder' => 'Select your main specialization',
                'category_name' => 'Plumbing',
            ],
            [
                'label' => 'Years of Plumbing Experience',
                'name' => 'plumbing_experience_years',
                'type' => 'number',
                'options' => null,
                'is_required' => true,
                'sort_order' => 2,
                'placeholder' => 'e.g. 6',
                'category_name' => 'Plumbing',
            ],
            [
                'label' => 'Trade Certification / Apprenticeship Number',
                'name' => 'plumbing_license_number',
                'type' => 'text',
                'options' => null,
                'is_required' => false,
                'sort_order' => 3,
                'placeholder' => 'e.g. ZW-PLUMB-3490 (optional)',
                'category_name' => 'Plumbing',
            ],
            [
                'label' => 'Own Professional Tools & Transport',
                'name' => 'plumbing_tools_transport',
                'type' => 'dropdown',
                'options' => [
                    'Full toolset + own work vehicle',
                    'Full hand & power toolset (use public/arranged transport)',
                    'Standard tools only',
                ],
                'is_required' => true,
                'sort_order' => 4,
                'placeholder' => 'Select equipment status',
                'category_name' => 'Plumbing',
            ],
            [
                'label' => 'Available for 24/7 Emergency Burst Pipe Callouts',
                'name' => 'emergency_callouts_available',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 5,
                'placeholder' => null,
                'category_name' => 'Plumbing',
            ],
        ];

        // ─── 3. Electrician Journey ──────────────────────────────────────────
        $electricalFields = [
            [
                'label' => 'Electrical Domain & Focus',
                'name' => 'electrical_specialization',
                'type' => 'dropdown',
                'options' => [
                    'Domestic Wiring & Fault Finding (Single Phase)',
                    'Solar PV, Lithium Batteries & Inverter Systems',
                    'Commercial & 3-Phase Industrial Power',
                    'Backup Generators & Automatic Transfer Switches (ATS)',
                    'Security Systems, CCTV & Electric Fencing',
                ],
                'is_required' => true,
                'sort_order' => 1,
                'placeholder' => 'Select electrical focus',
                'category_name' => 'Electrical',
            ],
            [
                'label' => 'Years of Electrical Experience',
                'name' => 'electrical_experience_years',
                'type' => 'number',
                'options' => null,
                'is_required' => true,
                'sort_order' => 2,
                'placeholder' => 'e.g. 5',
                'category_name' => 'Electrical',
            ],
            [
                'label' => 'License / Accreditation / Wireman’s License',
                'name' => 'wiremans_license_number',
                'type' => 'text',
                'options' => null,
                'is_required' => false,
                'sort_order' => 3,
                'placeholder' => 'e.g. ZERA-LIC-10492 / ZESA accredited',
                'category_name' => 'Electrical',
            ],
            [
                'label' => 'Solar & Inverter Sizing / Design Capability',
                'name' => 'solar_certified',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 4,
                'placeholder' => null,
                'category_name' => 'Electrical',
            ],
            [
                'label' => 'Certified to Issue Certificate of Compliance (COC)',
                'name' => 'coc_certified',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 5,
                'placeholder' => null,
                'category_name' => 'Electrical',
            ],
            [
                'label' => 'Emergency Electrical Callouts (Trip/Outage)',
                'name' => 'emergency_electric_available',
                'type' => 'checkbox',
                'options' => null,
                'is_required' => false,
                'sort_order' => 6,
                'placeholder' => null,
                'category_name' => 'Electrical',
            ],
        ];

        // Seed all fields idempotently
        foreach (array_merge($cleaningFields, $plumbingFields, $electricalFields) as $field) {
            RegistrationField::updateOrCreate(
                ['name' => $field['name'], 'category_name' => $field['category_name']],
                $field
            );
        }
    }
}
