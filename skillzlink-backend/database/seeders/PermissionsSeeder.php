<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['key' => 'manage_users', 'label' => 'Manage Users', 'category' => 'User Management'],
            ['key' => 'view_users', 'label' => 'View Users', 'category' => 'User Management'],
            ['key' => 'manage_providers', 'label' => 'Manage Providers', 'category' => 'Provider Management'],
            ['key' => 'view_providers', 'label' => 'View Providers', 'category' => 'Provider Management'],
            ['key' => 'manage_categories', 'label' => 'Manage Categories', 'category' => 'System Content'],
            ['key' => 'manage_form_builder', 'label' => 'Manage Form Builder', 'category' => 'System Content'],
            ['key' => 'manage_theme', 'label' => 'Manage Theme Settings', 'category' => 'System Config'],
            ['key' => 'view_api_logs', 'label' => 'View API Logs', 'category' => 'System Config'],
            ['key' => 'manage_roles', 'label' => 'Manage Roles & Permissions', 'category' => 'System Config'],
            ['key' => 'view_financials', 'label' => 'View Financial Data', 'category' => 'Reports'],
        ];
        
        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['key' => $perm['key']],
                ['label' => $perm['label'], 'category' => $perm['category'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
