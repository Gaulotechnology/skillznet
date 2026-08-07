<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Provider;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $categories = [
            'plumbing', 'electrical', 'cleaning', 'tutoring', 
            'carpentry', 'painting', 'gardening', 'appliance-repair'
        ];

        $cities = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Victoria Falls'];

        // Create 10 Seekers to act as reviewers
        $seekers = [];
        for ($s = 0; $s < 10; $s++) {
            $seekerUser = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'role' => 'seeker',
                'is_active' => true,
            ]);
            $seekers[] = \App\Models\Seeker::create([
                'user_id' => $seekerUser->id,
            ]);
        }

        for ($i = 0; $i < 100; $i++) {
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone_number' => '+263' . $faker->randomNumber(9, true),
                'password' => Hash::make('password123'),
                'role' => 'provider',
                'is_active' => true,
            ]);

            // We can generate a realistic profile picture using pravatar or randomuser
            $gender = $faker->randomElement(['men', 'women']);
            $imageId = $faker->numberBetween(1, 99);
            $profileImage = "https://randomuser.me/api/portraits/{$gender}/{$imageId}.jpg";

            $hourlyRate = $faker->randomFloat(2, 5, 50);
            $skillsPool = ['Pipe Fitting', 'Geyser Repair', 'Drain Unblocking', 'Wiring', 'Solar', 'Fault Finding', 'Furniture', 'Roofing', 'Maths', 'Physics', 'Painting', 'Landscaping'];
            $providerSkills = $faker->randomElements($skillsPool, $faker->numberBetween(2, 5));

            $provider = Provider::create([
                'user_id' => $user->id,
                'identity_number' => $faker->randomNumber(8, true) . $faker->randomLetter . $faker->randomNumber(2, true),
                'identity_verified' => $faker->boolean(80),
                'address' => $faker->address . ', ' . $faker->randomElement($cities),
                'latitude' => $faker->latitude(-22, -15),
                'longitude' => $faker->longitude(25, 33),
                'service_radius' => $faker->numberBetween(5, 50),
                'service_category' => $faker->randomElement($categories),
                'description' => $faker->paragraph(3),
                'profile_image' => $profileImage,
                'rating' => $faker->randomFloat(2, 3, 5),
                'total_ratings' => $faker->numberBetween(0, 200),
                'subscription_tier' => $faker->randomElement(['free', 'premium_monthly', 'premium_quarterly']),
                'subscription_expiry' => $faker->dateTimeBetween('now', '+1 year'),
                'is_featured' => $faker->boolean(20),
                'contact_opt_in' => true,
                'phone' => '+2637' . $faker->randomNumber(7, true),
                'hourly_rate' => $hourlyRate,
                'completed_services' => $faker->numberBetween(10, 500),
                'success_rate' => $faker->numberBetween(80, 100),
                'response_time' => $faker->randomElement(['1h', '2h', '4h', '1 Day']),
                'skills' => $providerSkills,
            ]);

            $numExperiences = $faker->numberBetween(1, 3);
            for ($j = 0; $j < $numExperiences; $j++) {
                \App\Models\ProviderExperience::create([
                    'provider_id' => $provider->id,
                    'title' => $faker->jobTitle,
                    'company' => $faker->company,
                    'date_range' => $faker->monthName . ' ' . $faker->year . ' - ' . ($faker->boolean(50) ? 'Present' : $faker->monthName . ' ' . $faker->year),
                    'description' => $faker->paragraph(2),
                ]);
            }

            // Seed Portfolios (Gallery)
            $numPortfolios = $faker->numberBetween(2, 6);
            for ($j = 0; $j < $numPortfolios; $j++) {
                \App\Models\ProviderPortfolio::create([
                    'provider_id' => $provider->id,
                    'image_url' => 'https://picsum.photos/seed/' . $faker->uuid . '/400/300',
                    'title' => $faker->words(3, true),
                    'description' => $faker->sentence,
                ]);
            }

            // Seed Services (Pricing Packages)
            $numServices = $faker->numberBetween(2, 4);
            for ($j = 0; $j < $numServices; $j++) {
                \App\Models\ProviderService::create([
                    'provider_id' => $provider->id,
                    'name' => ucwords($faker->words(2, true)),
                    'price' => $faker->randomFloat(2, 10, 200),
                    'description' => $faker->sentence,
                ]);
            }

            // Seed Ratings (Reviews)
            $numRatings = $faker->numberBetween(1, 5);
            $reviewSeekers = $faker->randomElements($seekers, $numRatings);
            foreach ($reviewSeekers as $seeker) {
                \App\Models\Rating::create([
                    'provider_id' => $provider->id,
                    'seeker_id' => $seeker->id,
                    'rating' => $faker->numberBetween(3, 5),
                    'comment' => $faker->paragraph(1),
                ]);
            }
        }
    }
}
