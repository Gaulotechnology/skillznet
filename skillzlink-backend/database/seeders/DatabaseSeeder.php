<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@skillzlink.local',
            'phone_number' => '+263771111111',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Provider
        $providerUser = User::factory()->create([
            'name' => 'Demo Provider',
            'email' => 'provider@skillzlink.local',
            'phone_number' => '+263772222222',
            'role' => 'provider',
            'is_active' => true,
        ]);
        \App\Models\Provider::create([
            'user_id' => $providerUser->id,
            'identity_number' => encrypt('ID-123456789'),
            'address' => '123 Demo St, Harare',
            'service_category' => 'plumbing',
            'service_radius' => 20,
            'description' => 'Demo provider for testing.',
        ]);

        // Seeker
        $seekerUser = User::factory()->create([
            'name' => 'Demo Seeker',
            'email' => 'seeker@skillzlink.local',
            'phone_number' => '+263773333333',
            'role' => 'seeker',
            'is_active' => true,
        ]);
        \App\Models\Seeker::create([
            'user_id' => $seekerUser->id,
        ]);

        $this->call(ProviderSeeder::class);
    }
}
