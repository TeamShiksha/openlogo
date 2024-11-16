import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Features from './Features';
import { featureItems } from "../../utils/constants";

describe('Features Component', () => {
    // Test to check if the component renders successfully with the correct heading and description text
    test('renders the component with headings and description text', () => {
        render(<Features />);
        
        // Check for main section headings
        const mainHeading = screen.getByRole('heading', { level: 2, name: /features/i });
        const subHeading = screen.getByRole('heading', { level: 5, name: /features/i });
        expect(mainHeading).toBeInTheDocument();
        expect(subHeading).toBeInTheDocument();
        
        // Check for main description paragraph
        const descriptionText = screen.getByText(/LogoExecutive provides fast API access to a vast, regularly updated logo library/i);
        expect(descriptionText).toBeInTheDocument();
    });

    // Test to check if all feature items are present with correct titles
    test('renders all feature items with correct titles', () => {
        render(<Features />);

        // Check each feature title is rendered
        const featureTitles = [
            "Fast & Reliable API Access",
            "Comprehensive Database",
            "Customizable Search Insights"
        ];

        featureTitles.forEach(title => {
            const featureTitle = screen.getByRole('heading', { level: 3, name: title });
            expect(featureTitle).toBeInTheDocument();
        });
    });

    // Test to check if each feature item has the correct title and content
    test('renders each feature item with correct title and content', () => {
        render(<Features />);

        // Check that each feature title and corresponding content is rendered
        featureItems.forEach(({ title, content }) => {
            const featureTitle = screen.getByRole('heading', { level: 3, name: title });
            const featureContent = screen.getByText(content);
            expect(featureTitle).toBeInTheDocument();
            expect(featureContent).toBeInTheDocument();
        });
    });
});

