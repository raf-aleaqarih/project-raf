export interface ContactSettings {
  unifiedPhone: string;
  marketingPhone: string;
  floatingPhone: string;
  floatingWhatsapp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchContactSettings(): Promise<ContactSettings | null> {
  try {
    const response = await fetch('https://dash-board.raf-advanced.sa/api/settings/contact', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<ContactSettings> = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('API returned error:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return null;
  }
} 