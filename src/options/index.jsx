import React, { useEffect, useState } from "react";
import { loadWebsites, addWebsite, removeWebsite } from "../websites";
import { useForm } from "react-hook-form";

export default () => {
    const [websites, setWebsites] = useState([]);
    const [createForm, setCreateForm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        (async () => {
            setWebsites(await loadWebsites());
        })();
    }, []);

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

    const handleDelete = (url) => {
        (async () => {
            setWebsites(await removeWebsite(websites, url));
        })();
    };

    return (
        <>
            {!createForm ? (
                <>
                    <table>
                        <tbody>
                            {websites.map((website, i) => (
                                <tr key={i}>
                                    <td>{website.name}</td>
                                    <td>
                                        <button>edit</button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                handleDelete(website.link);
                                            }}
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={() => {
                            setCreateForm(true);
                        }}
                    >
                        Add website
                    </button>
                </>
            ) : (
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
            )}
        </>
    );
};
