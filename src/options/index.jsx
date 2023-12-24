import React, { useEffect, useState, createContext } from "react";
import { loadWebsites, removeWebsite } from "../websites";
import { CreateForm } from "./forms/create";

export const WebsitesContext = createContext([]);
export const CreateFormContext = createContext(false);

export default () => {
    const [websites, setWebsites] = useState([]);
    const [createForm, setCreateForm] = useState(false);

    useEffect(() => {
        (async () => {
            setWebsites(await loadWebsites());
        })();
    }, []);

    const handleDelete = (url) => {
        (async () => {
            setWebsites(await removeWebsite(websites, url));
        })();
    };

    return (
        <WebsitesContext.Provider value={{ websites, setWebsites }}>
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
                <CreateFormContext.Provider value={{ setCreateForm }}>
                    <CreateForm />
                </CreateFormContext.Provider>
            )}
        </WebsitesContext.Provider>
    );
};
