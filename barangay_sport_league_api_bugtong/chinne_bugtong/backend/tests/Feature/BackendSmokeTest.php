<?php

namespace Tests\Feature;

use PHPUnit\Framework\TestCase;

class BackendSmokeTest extends TestCase
{
    public function test_it_contains_the_expected_backend_files(): void
    {
        $root = dirname(__DIR__, 2);

        $this->assertFileExists($root.'/app/Http/Controllers/AuthController.php');
        $this->assertFileExists($root.'/routes/api.php');
        $this->assertFileExists($root.'/database/seeders/DatabaseSeeder.php');
        $this->assertFileExists($root.'/bootstrap/app.php');
    }
}
