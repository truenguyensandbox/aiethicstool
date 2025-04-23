// Dark mode detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Bias detection keywords
const biasKeywords = {
    gender: ["men are better", "women are better", "men can't", "women can't", "typical male", "typical female", "belong in the"],
    race: ["they all", "those people", "these people", "racial superiority", "more intelligent race", "less capable"],
    age: ["too old to", "too young to", "old people can't", "millennials are all", "boomers are all", "gen z is"],
    religion: ["religious people are", "atheists are all", "christians are all", "muslims are all", "jews are all"],
    political: ["liberals all", "conservatives all", "republicans all", "democrats all", "left-wing people", "right-wing people"]
};

// Ethics concern keywords
const ethicsKeywords = {
    privacy: ["surveillance", "tracking", "monitoring", "private data", "personal information", "confidential"],
    harm: ["physical harm", "emotional distress", "dangerous", "harmful", "destructive", "weaponize"],
    autonomy: ["override", "violate consent", "force", "manipulation", "coerce", "bypass user"],
    deception: ["trick", "deceive", "mislead", "impersonate", "fake", "falsely", "counterfeit"]
};

// Transparency issue keywords
const transparencyKeywords = {
    disclosure: ["not disclosed", "hidden", "concealed", "undisclosed", "secret algorithm", "stealth"],
    explainability: ["unexplainable", "black box", "can't understand", "impossible to interpret", "cannot be explained"],
    sourceInfo: ["source unclear", "unverified facts", "unknown source", "unattributed", "uncited"]
};

// Fairness issue keywords
const fairnessKeywords = {
    opportunity: ["unequal access", "privileged access", "restricted to", "exclusive to", "only certain groups"],
    treatment: ["treated differently", "discriminates against", "favors", "biased against", "preferential treatment"],
    outcome: ["disparate impact", "disproportionately affects", "unequal outcomes", "disparate outcomes"]
};

document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    const contentInput = document.getElementById('content');
    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');
    
    analyzeBtn.addEventListener('click', function() {
        const content = contentInput.value.trim();
        
        if (!content) {
            alert('Please enter some content to analyze.');
            return;
        }
        
        // Get selected analysis types
        const selectedTypes = Array.from(document.querySelectorAll('input[name="analysis-type"]:checked')).map(el => el.value);
        
        if (selectedTypes.length === 0) {
            alert('Please select at least one type of analysis.');
            return;
        }
        
        // Show loading state
        loadingElement.classList.remove('hidden');
        resultsElement.classList.add('hidden');
        newAnalysisBtn.classList.add('hidden');
        
        // Simulate analysis delay
        setTimeout(() => {
            performAnalysis(content, selectedTypes);
            
            // Hide loading, show results
            loadingElement.classList.add('hidden');
            resultsElement.classList.remove('hidden');
            newAnalysisBtn.classList.remove('hidden');
        }, 1500);
    });
    
    newAnalysisBtn.addEventListener('click', function() {
        contentInput.value = '';
        resultsElement.classList.add('hidden');
        newAnalysisBtn.classList.add('hidden');
        contentInput.focus();
        
        // Re-check all checkboxes
        document.querySelectorAll('input[name="analysis-type"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    function performAnalysis(content, selectedTypes) {
        const contentLower = content.toLowerCase();
        let results = {};
        
        // Perform selected analyses
        if (selectedTypes.includes('bias')) {
            results.bias = analyzeBias(contentLower);
            updateResultCard('bias', results.bias);
        } else {
            document.getElementById('bias-card').classList.add('hidden');
        }
        
        if (selectedTypes.includes('ethics')) {
            results.ethics = analyzeEthics(contentLower);
            updateResultCard('ethics', results.ethics);
        } else {
            document.getElementById('ethics-card').classList.add('hidden');
        }
        
        if (selectedTypes.includes('transparency')) {
            results.transparency = analyzeTransparency(contentLower);
            updateResultCard('transparency', results.transparency);
        } else {
            document.getElementById('transparency-card').classList.add('hidden');
        }
        
        if (selectedTypes.includes('fairness')) {
            results.fairness = analyzeFairness(contentLower);
            updateResultCard('fairness', results.fairness);
        } else {
            document.getElementById('fairness-card').classList.add('hidden');
        }
        
        // Update overall assessment
        updateOverallAssessment(results);
        
        // Generate recommendations
        generateRecommendations(results);
    }
    
    function analyzeBias(content) {
        const result = { score: 0, details: [] };
        
        // Check for different types of bias
        for (const [category, terms] of Object.entries(biasKeywords)) {
            for (const term of terms) {
                if (content.includes(term)) {
                    result.details.push(`Potential ${category} bias detected: "${term}"`);
                    result.score += 25;
                }
            }
        }
        
        // Cap score at 100
        result.score = Math.min(result.score, 100);
        
        if (result.details.length === 0) {
            result.details.push("No obvious bias markers detected");
        }
        
        return result;
    }
    
    function analyzeEthics(content) {
        const result = { score: 0, details: [] };
        
        // Check for ethical concerns
        for (const [category, terms] of Object.entries(ethicsKeywords)) {
            for (const term of terms) {
                if (content.includes(term)) {
                    result.details.push(`Potential ${category} concern: "${term}"`);
                    result.score += 25;
                }
            }
        }
        
        // Cap score at 100
        result.score = Math.min(result.score, 100);
        
        if (result.details.length === 0) {
            result.details.push("No obvious ethical concerns detected");
        }
        
        return result;
    }
    
    function analyzeTransparency(content) {
        const result = { score: 0, details: [] };
        
        // Check for transparency issues
        for (const [category, terms] of Object.entries(transparencyKeywords)) {
            for (const term of terms) {
                if (content.includes(term)) {
                    result.details.push(`Potential ${category} issue: "${term}"`);
                    result.score += 30;
                }
            }
        }
        
        // Check for certainty language
        const certaintyTerms = ["certainly", "definitely", "absolutely", "without doubt", "guaranteed"];
        for (const term of certaintyTerms) {
            if (content.includes(term)) {
                result.details.push(`High certainty language detected: "${term}"`);
                result.score += 15;
            }
        }
        
        // Check for qualifying language
        const qualifyingTerms = ["may", "might", "could", "possibly", "uncertain", "unclear"];
        let qualifiersFound = false;
        for (const term of qualifyingTerms) {
            if (content.includes(term)) {
                qualifiersFound = true;
                break;
            }
        }
        
        if (!qualifiersFound && content.length > 300) {
            result.details.push("Lack of qualifying language in lengthy content");
            result.score += 20;
        }
        
        // Cap score at 100
        result.score = Math.min(result.score, 100);
        
        if (result.details.length === 0) {
            result.details.push("No obvious transparency issues detected");
        }
        
        return result;
    }
    
    function analyzeFairness(content) {
        const result = { score: 0, details: [] };
        
        // Check for fairness issues
        for (const [category, terms] of Object.entries(fairnessKeywords)) {
            for (const term of terms) {
                if (content.includes(term)) {
                    result.details.push(`Potential ${category} issue: "${term}"`);
                    result.score += 30;
                }
            }
        }
        
        // Check for unequal representation
        const groupTerms = [
            { term: "only men", score: 25 },
            { term: "only women", score: 25 },
            { term: "only white", score: 25 },
            { term: "only black", score: 25 },
            { term: "exclusively for", score: 20 }
        ];
        
        for (const { term, score } of groupTerms) {
            if (content.includes(term)) {
                result.details.push(`Potential unequal representation: "${term}"`);
                result.score += score;
            }
        }
        
        // Cap score at 100
        result.score = Math.min(result.score, 100);
        
        if (result.details.length === 0) {
            result.details.push("No obvious fairness issues detected");
        }
        
        return result;
    }
    
    function updateResultCard(type, result) {
        const scoreElement = document.getElementById(`${type}-score`);
        const detailsElement = document.getElementById(`${type}-details`);
        
        scoreElement.textContent = `${result.score}%`;
        
        // Clear previous details
        detailsElement.innerHTML = '';
        
        // Add detail items
        result.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            detailsElement.appendChild(li);
        });
        
        // Set color based on score
        if (result.score <= 25) {
            scoreElement.className = 'text-3xl font-bold text-green-500 mb-2';
        } else if (result.score <= 50) {
            scoreElement.className = 'text-3xl font-bold text-yellow-500 mb-2';
        } else if (result.score <= 75) {
            scoreElement.className = 'text-3xl font-bold text-orange-500 mb-2';
        } else {
            scoreElement.className = 'text-3xl font-bold text-red-500 mb-2';
        }
    }
    
    function updateOverallAssessment(results) {
        const overallElement = document.getElementById('overall-assessment');
        
        // Calculate average score from all analyses
        const scores = Object.values(results).map(r => r.score);
        const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
        
        let assessment = '';
        
        if (avgScore <= 25) {
            assessment = `<span class="font-semibold text-green-600 dark:text-green-400">Low Risk (${avgScore.toFixed(1)}%)</span>: The content appears to have minimal ethical concerns. It demonstrates good practices in terms of fairness, transparency, and minimizing bias.`;
        } else if (avgScore <= 50) {
            assessment = `<span class="font-semibold text-yellow-600 dark:text-yellow-400">Moderate Risk (${avgScore.toFixed(1)}%)</span>: The content has some potential ethical issues that should be addressed. Consider reviewing the highlighted concerns before deployment.`;
        } else if (avgScore <= 75) {
            assessment = `<span class="font-semibold text-orange-600 dark:text-orange-400">High Risk (${avgScore.toFixed(1)}%)</span>: Significant ethical concerns were detected. This content may require substantial revision before it's suitable for deployment in AI systems.`;
        } else {
            assessment = `<span class="font-semibold text-red-600 dark:text-red-400">Very High Risk (${avgScore.toFixed(1)}%)</span>: Critical ethical issues were found. This content is not recommended for use in AI systems without major revision and oversight.`;
        }
        
        overallElement.innerHTML = assessment;
    }
    
    function generateRecommendations(results) {
        const recommendationsElement = document.getElementById('recommendations');
        
        // Clear previous recommendations
        recommendationsElement.innerHTML = '';
        
        const recommendations = [];
        
        // Generate recommendations based on analysis
        if (results.bias && results.bias.score > 25) {
            recommendations.push("Review content for potential biases and consider more inclusive or neutral language");
        }
        
        if (results.ethics && results.ethics.score > 25) {
            recommendations.push("Address ethical concerns, particularly around harm, privacy, and manipulation");
        }
        
        if (results.transparency && results.transparency.score > 25) {
            recommendations.push("Improve transparency by clearly indicating AI-generated content, including limitations and confidence levels");
        }
        
        if (results.fairness && results.fairness.score > 25) {
            recommendations.push("Ensure equitable treatment and representation of different groups in the content");
        }
        
        // Add general recommendations
        recommendations.push("Consider having diverse reviewers evaluate the content before deployment");
        recommendations.push("Document the intended use case and limitations of this AI-generated content");
        
        // Add recommendation items
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsElement.appendChild(li);
        });
    }
});