const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

async function testApi(){
    const abortController = new AbortController;
    const response = await listDecks(abortController.signal)
    console.log(response)
}

testApi()

async function fetchJson(url, options, onCancel) {
    try {
      const response = await fetch(url, options);
  
      if (response.status < 200 || response.status > 399) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
  
      if (response.status === 204) {
        return null;
      }
  
      return await response.json();
  
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error.stack);
        throw error;
      }
      return Promise.resolve(onCancel);
    }
  }

async function listDecks(signal) {
    const url = `${API_BASE_URL}/decks?_embed=cards`;
    return await fetchJson(url, { signal }, []);
  }

