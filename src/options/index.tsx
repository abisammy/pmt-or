import React, { useEffect, useState } from "react";
import { importWebsites, WebsitesMap } from "../websites";

export const Test: React.FC = () => {
    // /    const [count, setCount] = useState(0);
    const [websites, setWebsites] = useState<WebsitesMap>([]);
    const [createForm, setCreateForm] = useState(false);

    useEffect(() => {
        (async () => {
            const w = await importWebsites();
            setWebsites(w);
        })();
    }, []);

    return (
        <>
            {!createForm ? (
                <>
                    <table>
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
                <form>
                    <input>Hello</input>
                </form>
            )}
        </>
    );
};
