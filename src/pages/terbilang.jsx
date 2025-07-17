import { terbilang } from "@/utils/terbilang";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import { CheckCircle2, CopyIcon, RotateCcwIcon } from "lucide-react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
    const [data, setData] = useState({
        number: "",
        hasil: "",
    });
    const [message, setMessage] = useState(null);

    const hasilRef = useRef();

    const handleChange = useCallback(
        (e) => {
            const { target } = e;
            const name = target.name;

            if (message) {
                setMessage(null);
            }

            setData((prev) => ({ ...prev, [name]: target.value }));
        },
        [message]
    );

    useEffect(() => {
        if (!data.number) {
            setData((prev) => ({ ...prev, hasil: "" }));
            return;
        }

        let hasil = terbilang(data.number).trim();
        if (hasil !== "") {
            hasil = hasil + " Rupiah";
        } else {
            hasil = "Sistem belum bisa mengenali angka ini";
        }

        setData((prev) => ({ ...prev, hasil }));
    }, [data.number]);

    const handleCopy = useCallback(() => {
        const textarea = hasilRef.current?.querySelector("textarea");
        if (textarea.value.trim()) {
            textarea.select();
            document.execCommand("copy");
            setMessage("Teks tersalin!");
        }
    }, [hasilRef]);

    return (
        <>
            <Head>
                <title>Terbilang</title>
                <meta
                    name="description"
                    content="Alat konversi nomor jadi teks"
                />
            </Head>
            <main className="w-full min-h-screen bg-blue-gray-50 p-2">
                <Card className="mx-auto max-w-2xl p-2">
                    <CardBody>
                        <div>
                            <Typography variant="h1" className="text-2xl mb-4">
                                Konversi nomor ke teks
                            </Typography>

                            <div className="flex flex-col gap-4">
                                <Input
                                    type="number"
                                    name="number"
                                    label="Masukkan Harga"
                                    size="lg"
                                    className="w-full"
                                    value={data.number}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                <Textarea
                                    ref={hasilRef}
                                    name="hasil"
                                    label="Hasil"
                                    value={data.hasil}
                                    onChange={handleChange}
                                />

                                <Button
                                    className="flex items-center justify-center gap-2"
                                    onClick={handleCopy}
                                    color="blue"
                                    variant="gradient"
                                >
                                    <CopyIcon className="size-4" /> Salin
                                </Button>
                                <Button
                                    className="flex items-center justify-center gap-2"
                                    variant="gradient"
                                    color="red"
                                    onClick={() =>
                                        setData({ number: "", hasil: "" })
                                    }
                                >
                                    <RotateCcwIcon className="size-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <div className="fixed bottom-1 left-[50%] -translate-x-[50%] z-[9999] mb-5">
                    <Alert
                        color="green"
                        icon={<CheckCircle2 />}
                        className={clsx(!message && "invisible")}
                        onClose={() => setMessage(null)}
                    >
                        {message}
                    </Alert>
                </div>
            </main>
        </>
    );
}
