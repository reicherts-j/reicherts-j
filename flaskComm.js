const FlaskComm = {
    apiUrl: 'http://localhost:5000',

    async processPapers(papersArray) {
        try {
            const response = await fetch(`${this.apiUrl}/process-papers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(papersArray)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const processedData = await response.json();
            console.log('Papers processed successfully:', processedData);
            return processedData;
        } catch (error) {
            console.error('Error processing papers:', error);
            return null;
        }
    },

    async translatePaper(paper, targetLanguage = 'en') {
        try {
            const response = await fetch(`${this.apiUrl}/translate-paper`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: targetLanguage,
                    paper: paper
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
            }

            const translatedData = await response.json();
            if (translatedData.error) {
                console.error('Translation error response:', translatedData.error);
                return null;
            }
            console.log(`Paper translated to ${targetLanguage}:`, translatedData);
            return translatedData;
        } catch (error) {
            console.error('Error translating paper:', error);
            return null;
        }
    },

    async translatePapers(papersArray, targetLanguage = 'de') {
        try {
            const response = await fetch(`${this.apiUrl}/translate-papers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: targetLanguage,
                    papers: papersArray
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const translatedData = await response.json();
            console.log(`Papers translated to ${targetLanguage}:`, translatedData);
            return translatedData;
        } catch (error) {
            console.error('Error translating papers:', error);
            return null;
        }
    },

    updatePapersData(papersArray) {
        if (typeof papersData !== 'undefined') {
            papersData.splice(0, papersData.length, ...papersArray);
            console.log('papersData updated');
            if (typeof rerenderPapersGrid === 'function') {
                rerenderPapersGrid();
            }
            return true;
        }
        console.error('papersData is not defined');
        return false;
    },

    async processAndUpdate(papersArray) {
        const processed = await this.processPapers(papersArray);
        if (processed) {
            this.updatePapersData(processed);
            return processed;
        }
        return null;
    },

    async translateAndUpdate(papersArray, targetLanguage = 'de') {
        const translated = await this.translatePapers(papersArray, targetLanguage);
        if (translated) {
            this.updatePapersData(translated);
            return translated;
        }
        return null;
    }
};
