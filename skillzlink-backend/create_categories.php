<?php
$categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'Painting',
    'IT Support',
    'Appliance Repair',
    'Landscaping',
    'Security',
    'Tutoring'
];

foreach ($categories as $cat) {
    \App\Models\ServiceCategory::firstOrCreate([
        'name' => $cat,
        'slug' => \Illuminate\Support\Str::slug($cat)
    ]);
}
echo "Categories created.\n";
