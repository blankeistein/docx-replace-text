import {
    Card,
    CardBody,
    Checkbox,
    IconButton,
    Input,
    Typography,
} from "@material-tailwind/react";
import { DownloadIcon } from "lucide-react";
import Head from "next/head";
import { useState } from "react";

const TABLE_HEAD = ["", "Name", "Role", "Email", "Location"];

const TABLE_ROWS = [
    {
        id: 1,
        name: "Mary Smith",
        role: "Project Manager",
        email: "mary.smith@example.com",
        location: "New York, USA",
    },
    {
        id: 2,
        name: "Bob Johnson",
        role: "Lead Developer",
        email: "bob.johnson@example.com",
        location: "London, UK",
    },
    {
        id: 3,
        name: "Carol White",
        role: "UX Designer",
        email: "carol.white@example.com",
        location: "Berlin, Germany",
    },
    {
        id: 4,
        name: "David Brown",
        role: "QA Engineer",
        email: "david.brown@example.com",
        location: "Sydney, Australia",
    },
];

export default function DocxTemplater() {
    const [data, setData] = useState({
        masterFile: null,
        dataFile: null,
        filenamePrefix: "File {index}",
    });

    const [dataList, setDataList] = useState([]);

    const handleInput = (e) => {};

    return (
        <>
            <Head>
                <title>Docx Templater</title>
            </Head>
            <main className="w-full min-h-screen bg-blue-gray-50 p-1">
                <div className="flex flex-col mx-auto max-w-5xl">
                    <Card className="mt-4">
                        <CardBody>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <Input
                                        type="file"
                                        name="masterFile"
                                        label="File Template"
                                        size="lg"
                                        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    />
                                    <Input
                                        type="file"
                                        name="masterFile"
                                        label="File Data"
                                        size="lg"
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    />
                                </div>
                                <Input
                                    type="text"
                                    label="Nama File"
                                    value={data.filenamePrefix}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            filenamePrefix: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="my-4">
                        <CardBody>
                            {dataList.length === 0 && (
                                <Typography variant="paragraph">
                                    Data kosong
                                </Typography>
                            )}
                            {dataList.length > 0 && (
                                <div className="overflow-auto">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((head) => (
                                                    <th
                                                        key={head}
                                                        className="hover:bg-blue-gray-100 border-b border-gray-300 py-4 p-1 cursor-pointer"
                                                    >
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-bold leading-none"
                                                        >
                                                            {head}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TABLE_ROWS.map(
                                                (
                                                    {
                                                        name,
                                                        role,
                                                        email,
                                                        location,
                                                    },
                                                    index
                                                ) => {
                                                    const isLast =
                                                        index ===
                                                        TABLE_ROWS.length - 1;
                                                    const classes = isLast
                                                        ? "py-2"
                                                        : "py-2 border-b border-gray-300";

                                                    return (
                                                        <tr
                                                            key={name}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td
                                                                className={
                                                                    classes
                                                                }
                                                            >
                                                                <div className="flex gap-1 items-center">
                                                                    <Checkbox />
                                                                    <IconButton size="sm">
                                                                        <DownloadIcon className="size-4" />
                                                                    </IconButton>
                                                                </div>
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-bold"
                                                                >
                                                                    {name}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="small"
                                                                    className="font-normal text-gray-600"
                                                                >
                                                                    {role}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="small"
                                                                    className="font-normal text-gray-600"
                                                                >
                                                                    {email}
                                                                </Typography>
                                                            </td>
                                                            <td
                                                                className={
                                                                    classes
                                                                }
                                                            >
                                                                <Typography
                                                                    variant="small"
                                                                    className="font-normal text-gray-600"
                                                                >
                                                                    {location}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </main>
        </>
    );
}
