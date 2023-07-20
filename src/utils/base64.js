export async function imageUrlToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            console.log('Base64 encoded image data:', base64String);
            // Use the base64String for your desired purposes (e.g., displaying in an image tag)
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Error converting image to Base64:', error);
    }
}