import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import { motion } from "motion/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";
const tools = [
    {
        name: "Konversi harga ke teks",
        thumbnail: "/images/tools/terbilang.webp",
        page: "/terbilang",
    },
    {
        name: "Docx Templater",
        thumbnail: "/images/tools/docx-templater.webp",
        page: "/docx-templater",
    },
];

export default function Home() {
    const router = useRouter();

    const handleClick = useCallback((url) => {
        router.push(url);
    }, []);

    return (
        <>
            <Head>
                <title>Daftar Alat</title>
                <meta name="description" content="Kumpulan tools" />
            </Head>

            <main className="w-full min-h-screen bg-blue-gray-50 flex flex-col justify-center items-center p-1">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 px-4 gap-4 w-full mx-auto max-w-6xl">
                    {tools.map((tool) => (
                        <motion.div
                            className="cursor-pointer"
                            key={tool.name}
                            whileTap={{ scale: 1.1 }}
                        >
                            <Card onClick={() => handleClick(tool.page)}>
                                <CardHeader>
                                    <img
                                        src={tool.thumbnail}
                                        width="100%"
                                        height="56px"
                                    />
                                </CardHeader>
                                <CardBody>
                                    <Typography variant="h5">
                                        {tool.name}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </>
    );
}
