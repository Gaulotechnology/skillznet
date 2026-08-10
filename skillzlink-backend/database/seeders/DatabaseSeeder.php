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
        User::firstOrCreate(
            ['phone_number' => '+263771111111'],
            [
                'name' => 'Admin User',
                'email' => 'admin@skillzlink.local',
                'role' => 'admin',
                'is_active' => true,
                'password' => bcrypt('1234'),
            ]
        );

        // Provider
        $providerUser = User::firstOrCreate(
            ['phone_number' => '+263772222222'],
            [
                'name' => 'Demo Provider',
                'email' => 'provider@skillzlink.local',
                'role' => 'provider',
                'is_active' => true,
                'password' => bcrypt('1234'),
            ]
        );
        \App\Models\Provider::firstOrCreate(
            ['user_id' => $providerUser->id],
            [
                'identity_number' => encrypt('ID-123456789'),
                'address' => '123 Demo St, Harare',
                'service_category' => 'plumbing',
                'service_radius' => 20,
                'description' => 'Demo provider for testing.',
            ]
        );

        // Seeker
        $seekerUser = User::firstOrCreate(
            ['phone_number' => '+263773333333'],
            [
                'name' => 'Demo Seeker',
                'email' => 'seeker@skillzlink.local',
                'role' => 'seeker',
                'is_active' => true,
                'password' => bcrypt('1234'),
            ]
        );
        \App\Models\Seeker::firstOrCreate(
            ['user_id' => $seekerUser->id],
            []
        );

        // Agent
        User::firstOrCreate(
            ['phone_number' => '+263774444444'],
            [
                'name' => 'Demo Agent',
                'email' => 'agent@skillzlink.local',
                'role' => 'agent',
                'is_active' => true,
                'password' => bcrypt('1234'),
            ]
        );

        // Affiliate
        User::firstOrCreate(
            ['phone_number' => '+263775555555'],
            [
                'name' => 'Demo Affiliate',
                'email' => 'affiliate@skillzlink.local',
                'role' => 'affiliate',
                'is_active' => true,
                'password' => bcrypt('1234'),
            ]
        );

        $this->call(ProviderSeeder::class);
        $this->call(PermissionsSeeder::class);
    }
}
