export const formDataFromObject = (data) => {
    let formData  = new FormData();

    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            formData.append(key, data[key])
        }
    });

    return formData;
}