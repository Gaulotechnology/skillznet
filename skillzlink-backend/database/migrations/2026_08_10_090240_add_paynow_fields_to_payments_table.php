<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (! Schema::hasColumn('payments', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            }
            if (! Schema::hasColumn('payments', 'reference')) {
                $table->string('reference')->nullable()->unique()->after('id');
            }
            if (! Schema::hasColumn('payments', 'package_id')) {
                $table->foreignId('package_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            }
            if (! Schema::hasColumn('payments', 'method')) {
                $table->string('method')->nullable()->after('currency');
            }
            if (! Schema::hasColumn('payments', 'description')) {
                $table->string('description')->nullable()->after('amount');
            }
            if (! Schema::hasColumn('payments', 'poll_url')) {
                $table->text('poll_url')->nullable()->after('status');
            }
            if (! Schema::hasColumn('payments', 'notes')) {
                $table->text('notes')->nullable()->after('poll_url');
            }
            if (! Schema::hasColumn('payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('updated_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'reference', 'package_id', 'method', 'description',
                'poll_url', 'notes', 'paid_at',
            ]);
        });
    }
};
