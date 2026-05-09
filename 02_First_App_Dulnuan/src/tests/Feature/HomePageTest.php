<?php

namespace Tests\Feature;

/**
 * Test case for the homepage functionality.
 */
class HomePageTest extends \Tests\TestCase
{
    /**
     * Test that the home page loads successfully.
     */
    public function test_home_page_loads_successfully()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertViewIs('home');
        $response->assertSee('first_app');
    }
}
