import { getData, replaceDocx } from "@/utils/docx-templater";
import download, { readAsArrayBuffer } from "@/utils/general";
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
import JSZip from "jszip";
import {
    CheckIcon,
    CopyIcon,
    DownloadIcon,
    HomeIcon,
    MinusIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SELECT_ALL_STATUS = {
    NONE: 0,
    INDETERMINATE: 1,
    ALL: 2,
};

const DEFAULT_FILENAME_PREFIX = "File {index}";

export default function DocxTemplater() {
    const [data, setData] = useState({
        masterFile: null,
        dataFile: null,
        filenamePrefix: "File {index}",
    });

    const [tableHead, setTableHead] = useState([]);
    const [tableBody, setTableBody] = useState([]);

    const handleInputTemplate = async (e) => {
        const { target } = e;
        if (target.files[0]) {
            const file = target.files[0];
            setData((prev) => ({ ...prev, masterFile: file }));
        }
    };

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
            setData((prev) => ({ ...prev, dataFile: file }));

            reader.readAsArrayBuffer(file);
        }
    };

    const selectAll = useMemo(() => {
        const checked = tableBody.filter((item) => item.__checked);
        if (checked.length === 0) return SELECT_ALL_STATUS.NONE;
        if (checked.length < tableBody.length)
            return SELECT_ALL_STATUS.INDETERMINATE;

        return SELECT_ALL_STATUS.ALL;
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

                newItem.__checked =
                    selectAll === SELECT_ALL_STATUS.ALL ? false : true;
                return newItem;
            })
        );
    };

    const handleCopyHeader = useCallback((value) => {
        if ("navigator" in window) {
            window.navigator.clipboard
                .writeText("{" + value + "}")
                .then(() => toast.success("Berhasil disalin"));
        } else {
            toast.error("Browser mu tidak mendukung navigator");
        }
    }, []);

    const handleDownload = useCallback(
        async (index) => {
            if (!data.masterFile) {
                toast.error("Masukan file template");
                return;
            }

            let toastId = toast.loading("Waiting");
            try {
                const renderData = tableBody[index];
                renderData["index"] = 0;

                const result = await readAsArrayBuffer(data.masterFile);
                const buf = replaceDocx(result, renderData);

                const mimeType =
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                const blob = new Blob([buf], { type: mimeType });

                const filename =
                    data.filenamePrefix.replace(
                        /\{([^}]+)\}/g,
                        (match, key) => {
                            return renderData[key] !== undefined
                                ? renderData[key]
                                : match;
                        }
                    ) + ".docx";
                download(filename, blob);
            } catch (e) {
                toast.error(e.message);
            } finally {
                toast.dismiss(toastId);
            }
        },
        [data, tableBody]
    );

    const handleDownloadAll = useCallback(async () => {
        if (selectAll === SELECT_ALL_STATUS.NONE) return;

        if (!data.masterFile) {
            toast.error("Masukan file template");
            return;
        }

        let toastId = toast.loading("Sedang mengunduh semua data ...");
        try {
            const zip = new JSZip();
            let index = 1;
            for (const item of tableBody) {
                if (!item.__checked) {
                    continue;
                }
                console.log(item);

                item["index"] = index;

                const result = await readAsArrayBuffer(data.masterFile);
                const buf = await replaceDocx(result, item);

                const mimeType =
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                const blob = new Blob([buf], { type: mimeType });

                const filename =
                    data.filenamePrefix.replace(
                        /\{([^}]+)\}/g,
                        (match, key) => {
                            return item[key] !== undefined ? item[key] : match;
                        }
                    ) + ".docx";
                zip.file(filename, blob);
                index += 1;
            }

            let zipFilename = data.masterFile.name.split(".");
            delete zipFilename[zipFilename.length - 1];
            zipFilename = zipFilename.join(".");

            download(
                zipFilename + "zip",
                await zip.generateAsync({ type: "blob" })
            );
        } catch (e) {
            toast.error(e.message);
        } finally {
            toast.dismiss(toastId);
        }
    }, [data, tableBody]);

    return (
        <>
            <Head>
                <title>Docx Templater</title>
            </Head>
            <main className="w-full min-h-screen bg-blue-gray-50 p-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-2 mx-auto max-w-6xl px-5">
                    <Card className="mt-4 lg:sticky">
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
                                        onChange={handleInputTemplate}
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
                                    <Chip
                                        variant="gradient"
                                        value="{index}"
                                        className="rounded-full cursor-pointer"
                                        onClick={() =>
                                            setData((prev) => ({
                                                ...prev,
                                                filenamePrefix:
                                                    prev.filenamePrefix.trim() +
                                                    " {index}",
                                            }))
                                        }
                                    />
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
                                                        prev.filenamePrefix.trim() +
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
                        <Card className="my-4  overflow-auto">
                            <CardBody>
                                <Typography variant="h5" className="mb-5">
                                    Data
                                </Typography>
                                <div className="lg:h-[calc(100vh-9.2rem)] overflow-auto">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                <th className="border-b border-gray-300 py-2 p-1 cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Checkbox
                                                            checked={
                                                                selectAll >
                                                                SELECT_ALL_STATUS.NONE
                                                            }
                                                            onChange={
                                                                handleSelectAll
                                                            }
                                                            icon={
                                                                selectAll ===
                                                                SELECT_ALL_STATUS.ALL ? (
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
                                                        <IconButton
                                                            size="sm"
                                                            disabled={
                                                                selectAll <
                                                                SELECT_ALL_STATUS.INDETERMINATE
                                                            }
                                                            onClick={
                                                                handleDownloadAll
                                                            }
                                                            aria-label="Download Semua"
                                                        >
                                                            <DownloadIcon className="size-4" />
                                                        </IconButton>
                                                    </div>
                                                </th>
                                                {tableHead.map((head) => (
                                                    <motion.th
                                                        key={head}
                                                        className="group hover:bg-blue-gray-100 border-b border-gray-300 py-4 px-2 min-w-36 cursor-pointer"
                                                        onClick={() =>
                                                            handleCopyHeader(
                                                                head
                                                            )
                                                        }
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-bold leading-none flex items-center gap-2"
                                                        >
                                                            {head}
                                                            <CopyIcon className="group-hover:opacity-100 opacity-0 transition-all size-4" />
                                                        </Typography>
                                                    </motion.th>
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
                                                                <IconButton
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDownload(
                                                                            index
                                                                        )
                                                                    }
                                                                    aria-label="Download"
                                                                >
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
