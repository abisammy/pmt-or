import React, { useContext } from "react";
import { CreateFormContext, WebsitesContext } from "..";
import { addWebsite } from "../../websites";

import { useForm } from "react-hook-form";

export const CreateForm = () => {
    const { websites, setWebsites } = useContext(WebsitesContext);
    const { setCreateForm } = useContext(CreateFormContext);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const handleCreateSubmit = (data) => {
        (async () => {
            const w = await addWebsite(websites, data);
            if (w === false) {
                // TODO: simply edit not create
                return;
            } else {
                setWebsites(w);
            }
            setCreateForm(false);
        })();
    };

    return (
        <form onSubmit={handleSubmit((data) => handleCreateSubmit(data))}>
            <input {...register("name", { required: true })} placeholder="Name" />
            {errors.name && <p>{errors.name.message}</p>}
            <input {...register("link", { required: true })} placeholder="URL" />
            {errors.link && <p>{errors.link.message}</p>}
            <input {...register("urlMatches", { required: true })} placeholder="URL Matches" />
            {errors.urlMatches && <p>{errors.urlMatches.message}</p>}
            <input {...register("urlFormat", { required: true })} placeholder="URL Format" />
            {errors.urlFormat && <p>{errors.urlFormat.message}</p>}
            <input {...register("searchParam", { required: true })} placeholder="Search Param" />
            {errors.searchParam && <p>{errors.searchParam.message}</p>}
            <input type="submit" />
        </form>
    );
};
