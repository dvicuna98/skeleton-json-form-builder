import FormClient from "@/repositories/FormClient";

export default {

    postDocument(url, payload,headers) {
        return FormClient.post(`${url}/documents`, payload, headers);
    },

};