<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->integer('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('social_links')->nullable();
            $table->timestamps();
        });

        // Seed default initial team members
        \DB::table('team_members')->insert([
            [
                'name' => 'Tinashe Moyo',
                'role' => 'Co-Founder & CEO',
                'bio' => 'Harare native passionate about closing the skills gap in Zimbabwe. Former software engineer turned entrepreneur.',
                'photo_url' => '/images/team/team-tinashe.jpg',
                'order_index' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Chipo Ndlovu',
                'role' => 'Head of Marketing',
                'bio' => 'Brand strategist with 6 years experience in Zimbabwean digital markets. Leads growth and community.',
                'photo_url' => '/images/team/team-chipo.jpg',
                'order_index' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tafadzwa Chigumba',
                'role' => 'Lead Engineer',
                'bio' => "Full-stack developer from Bulawayo building the technology that powers SkillzLink's WhatsApp integrations.",
                'photo_url' => '/images/team/team-tafadzwa.jpg',
                'order_index' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rudo Makoni',
                'role' => 'Head of Operations',
                'bio' => 'Operations expert ensuring every professional on SkillzLink is vetted, verified, and ready to serve Zimbabwe.',
                'photo_url' => '/images/team/team-rudo.jpg',
                'order_index' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
