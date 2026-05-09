<?php

namespace Tests\Feature;

/**
 * Test case for the about page functionality.
 */
class AboutPageTest extends \Tests\TestCase
{
    /**
     * Test that the about page loads successfully.
     */
    public function test_about_page_loads_successfully()
    {
        $response = $this->get('/about');

        $response->assertStatus(200);
        $response->assertViewIs('about');
        $response->assertSee('About this Project');
    }
}
