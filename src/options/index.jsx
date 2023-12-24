import React, { useEffect, useState } from "react";
import { importWebsites, addWebsite } from "../websites";
import { useForm } from "react-hook-form";

export default () => {
    const [websites, setWebsites] = useState([]);
    const [createForm, setCreateForm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    useEffect(() => {
        (async () => {
            const w = await importWebsites();
            setWebsites(w);
        })();
    }, []);

    const handleCreateSubmit = (data) => {
        try {
            addWebsite(data);
        } catch (error) {
            // TODO: figure out how to return to form
            console.error(error);
            // setError("Invalid URL", "urlFormat");
        }
        setCreateForm(false);
    };

    return (
        <>
            {!createForm ? (
                <>
                    <table>
                        <tbody>
                            {Array.from(websites).map((website, i) => (
                                <tr key={i}>
                                    <td>{website[1].name}</td>
                                    <td>
                                        <button>edit</button>
                                    </td>
                                    <td>
                                        <button>delete</button>
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
                    <input {...register("link", { required: true })} placeholder="URL" />
                    <input {...register("urlMatches", { required: true })} placeholder="URL Matches" />
                    <input {...register("urlFormat", { required: true })} placeholder="URL Format" />
                    <input {...register("searchParam", { required: true })} placeholder="Search Param" />
                    {errors.lastName && <p>Last name is required!</p>}
                    <input type="submit" />
                </form>
            )}
        </>
    );
};
