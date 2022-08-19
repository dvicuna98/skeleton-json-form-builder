import FormRepository from "@/repositories/FormRepository";
import FormDocumentsRepository from "@/repositories/FormDocumentsRepository";

const repositories = {
    'FormRepository': FormRepository,
    'FormDocumentsRepository': FormDocumentsRepository
}

export default {
    get: name => repositories[name]
};