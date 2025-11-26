// This is a mock service to simulate calls to the Gemini API.
// In a real application, this file would contain the actual API calls
// using the @google/genai library.

// Note: The @google/genai import is included to show what a real implementation
// would look like, but it's not used in this mock.
// import { GoogleGenAI } from "@google/genai";

// Mock function to simulate a delay for the API call
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This function simulates calling the Gemini API to get insights.
export const getGeminiInsights = async (
    inactiveCount: number,
    totalCount: number,
    potentialSavings: number,
    inactivityPeriod: number
): Promise<string> => {
    console.log("Simulating call to Gemini API...");

    // In a real app, you would initialize the client like this:
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const inactivePercentage = totalCount > 0 ? ((inactiveCount / totalCount) * 100).toFixed(1) : 0;

    // This prompt would be sent to the Gemini model in a real application.
    const prompt = `
        As an expert in enterprise SaaS management and cost optimization, analyze the following data and provide actionable insights.
        Format your response in simple HTML using headings, lists, and bold tags. Do not include markdown.

        Data:
        - Total Users: ${totalCount}
        - Inactive Users (inactive for >${inactivityPeriod} days): ${inactiveCount}
        - Percentage of Inactive Users: ${inactivePercentage}%
        - Estimated Monthly Savings from deactivating inactive users: $${potentialSavings.toLocaleString()}

        Provide a brief summary, identify key areas of concern, and suggest 2-3 concrete, actionable steps the IT admin should take next.
        Focus on the financial impact and security implications.
    `;

    // In a real app, you would make the API call here:
    /*
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
    */

    await sleep(2000); // Simulate network latency

    // This is a mock response that mimics what the Gemini API might return.
    const mockApiResponse = `
        <h4>Summary of Account Activity</h4>
        <p>Your organization has <strong>${inactiveCount} inactive accounts</strong> out of ${totalCount} total users, representing ${inactivePercentage}% of your workforce. By deprovisioning these accounts, you could realize an estimated <strong>$${potentialSavings.toLocaleString()} in monthly savings</strong>, which amounts to over <strong>$${(potentialSavings * 12).toLocaleString()} annually</strong>.</p>
        
        <h4>Key Areas for Action</h4>
        <ul>
            <li><strong>Cost Optimization:</strong> A significant portion of your SaaS budget is being spent on unused licenses. Reclaiming these licenses is the fastest way to reduce operational costs.</li>
            <li><strong>Security Risk:</strong> Dormant accounts are a primary target for security breaches. Each inactive account represents an unnecessary entry point that could be exploited.</li>
        </ul>

        <h4>Recommended Next Steps</h4>
        <ol>
            <li><strong>Review & Deprovision:</strong> Navigate to the 'Users' tab and filter by 'Inactive' status. Select all and use the 'Deactivate' bulk action to immediately begin the deprovisioning process.</li>
            <li><strong>Notify Department Heads:</strong> Export the 'Inactive Users' report from the 'Reports' section and share it with department managers to confirm that these users no longer require access before final deactivation.</li>
            <li><strong>Adjust Inactivity Policy:</strong> Consider if the current ${inactivityPeriod}-day inactivity period is appropriate for all services. Some high-cost or high-risk applications might warrant a shorter period (e.g., 60 days). You can adjust this in the 'Settings' tab.</li>
        </ol>
    `;

    console.log("Mock Gemini response generated.");
    return mockApiResponse;
};
