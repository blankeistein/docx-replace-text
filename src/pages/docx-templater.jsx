import { getData } from "@/utils/docx-templater";
import {
    Breadcrumbs,
    Card,
    CardBody,
    Checkbox,
    Chip,
    IconButton,
    Input,
    Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import { CheckIcon, DownloadIcon, HomeIcon, MinusIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DocxTemplater() {
    const [data, setData] = useState({
        masterFile: null,
        dataFile: null,
        filenamePrefix: "File {index}",
    });

    const [tableHead, setTableHead] = useState([]);
    const [tableBody, setTableBody] = useState([]);

    const handleInputData = async (e) => {
        const { target } = e;
        if (target.files[0]) {
            const file = target.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                const excel = await getData(arrayBuffer);
                setTableHead(Object.keys(excel[0]));
                setTableBody(excel);
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const selectAll = useMemo(() => {
        const checked = tableBody.filter((item) => item.__checked);
        if (checked.length === 0) return 0;
        if (checked.length < tableBody.length) return 1;

        return 2;
    }, [tableBody]);

    const handleItemCheck = (index) => {
        setTableBody((prev) =>
            prev.map((item, key) => {
                if (index === key) {
                    const newItem = { ...item };

                    newItem.__checked = Boolean(!item.__checked);
                    return newItem;
                }

                return item;
            })
        );
    };

    const handleSelectAll = () => {
        setTableBody((prev) =>
            prev.map((item) => {
                const newItem = { ...item };

                newItem.__checked = selectAll === 2 ? false : true;
                return newItem;
            })
        );
    };

    const handleCopyHeader = useCallback((value) => {
        if (navigator in window) {
            window.navigator.clipboard
                .writeText("{" + value + "}")
                .then(() => alert("Berhasil disalin"));
        } else {
            toast.error("Browser mu tidak mendukung navigator");
        }
    }, []);

    return (
        <>
            <Head>
                <title>Docx Templater</title>
            </Head>
            <main className="w-full min-h-screen bg-blue-gray-50 p-1">
                <div className="flex flex-col mx-auto max-w-5xl">
                    <Card className="mt-4">
                        <CardBody>
                            <Breadcrumbs className="mb-8">
                                <Link
                                    href="/"
                                    className="flex justify-center items-center gap-2"
                                >
                                    <HomeIcon />
                                </Link>
                                <Typography variant="small">
                                    Docx Templater
                                </Typography>
                            </Breadcrumbs>
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
                                        onChange={handleInputData}
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
                                <div className="flex flex-wrap gap-1">
                                    {tableHead.map((chip, index) => (
                                        <Chip
                                            key={`${chip + index}`}
                                            variant="gradient"
                                            value={chip}
                                            className="rounded-full cursor-pointer"
                                            onClick={() =>
                                                setData((prev) => ({
                                                    ...prev,
                                                    filenamePrefix:
                                                        prev.filenamePrefix +
                                                        " {" +
                                                        chip +
                                                        "}",
                                                }))
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    {tableHead.length > 0 && tableBody.length > 0 && (
                        <Card className="my-4">
                            <CardBody>
                                <div className="overflow-auto">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                <th className="border-b border-gray-300 py-2 p-1 cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Checkbox
                                                            checked={
                                                                selectAll > 0
                                                            }
                                                            onChange={
                                                                handleSelectAll
                                                            }
                                                            icon={
                                                                selectAll ===
                                                                2 ? (
                                                                    <CheckIcon
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                        className="size-3"
                                                                    />
                                                                ) : (
                                                                    <MinusIcon
                                                                        strokeWidth={
                                                                            5
                                                                        }
                                                                        className="size-3"
                                                                    />
                                                                )
                                                            }
                                                        />
                                                        <IconButton size="sm">
                                                            <DownloadIcon className="size-4" />
                                                        </IconButton>
                                                    </div>
                                                </th>
                                                {tableHead.map((head) => (
                                                    <th
                                                        key={head}
                                                        className="hover:bg-blue-gray-100 border-b border-gray-300 py-4 px-2 min-w-36 cursor-pointer"
                                                        onClick={() =>
                                                            handleCopyHeader(
                                                                head
                                                            )
                                                        }
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
                                            {tableBody.map((item, index) => {
                                                const isLast =
                                                    index ===
                                                    tableBody.length - 1;
                                                const classes = isLast
                                                    ? "py-2"
                                                    : "py-2 border-b border-gray-300";

                                                return (
                                                    <tr
                                                        key={`row-${index}`}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td
                                                            className={clsx(
                                                                classes,
                                                                "w-24"
                                                            )}
                                                        >
                                                            <div className="flex gap-1 items-center">
                                                                <Checkbox
                                                                    checked={
                                                                        item.__checked
                                                                    }
                                                                    onChange={() =>
                                                                        handleItemCheck(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                                <IconButton size="sm">
                                                                    <DownloadIcon className="size-4" />
                                                                </IconButton>
                                                            </div>
                                                        </td>
                                                        {tableHead.map(
                                                            (key, index) => (
                                                                <td
                                                                    key={`${index}-${item[key]}`}
                                                                    className={
                                                                        classes
                                                                    }
                                                                >
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                    >
                                                                        {
                                                                            item[
                                                                                key
                                                                            ]
                                                                        }
                                                                    </Typography>
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </main>
            <Toaster position="bottom-right" />
        </>
    );
}
