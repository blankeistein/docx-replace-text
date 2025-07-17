Math.fmod = function (a, b) {
    return Number((a - Math.floor(a / b) * b).toPrecision(8));
};

export function terbilang(nilai) {
    const huruf = [
        "",
        "Satu",
        "Dua",
        "Tiga",
        "Empat",
        "Lima",
        "Enam",
        "Tujuh",
        "Delapan",
        "Sembilan",
        "Sepuluh",
        "Sebelas",
    ];
    let temp = "";
    if (nilai < 12) {
        temp = " " + huruf[nilai];
    } else if (nilai < 20) {
        temp = terbilang(nilai - 10) + " Belas";
    } else if (nilai < 100) {
        temp =
            terbilang(Math.floor(nilai / 10)) +
            " Puluh" +
            terbilang(nilai % 10);
    } else if (nilai < 200) {
        temp = " Seratus" + terbilang(nilai - 100);
    } else if (nilai < 1000) {
        temp =
            terbilang(Math.floor(nilai / 100)) +
            " Ratus" +
            terbilang(nilai % 100);
    } else if (nilai < 2000) {
        temp = " Seribu" + terbilang(nilai - 1000);
    } else if (nilai < 1000000) {
        temp =
            terbilang(Math.floor(nilai / 1000)) +
            " Ribu" +
            terbilang(nilai % 1000);
    } else if (nilai < 1000000000) {
        temp =
            terbilang(Math.floor(nilai / 1000000)) +
            " Juta" +
            terbilang(nilai % 1000000);
    } else if (nilai < 1000000000000) {
        temp =
            terbilang(Math.floor(nilai / 1000000000)) +
            " Milyar" +
            terbilang(Math.fmod(nilai, 1000000000));
    } else if (nilai < 1000000000000000) {
        temp =
            terbilang(Math.floor(nilai / 1000000000000)) +
            " Trilyun" +
            terbilang(Math.fmod(nilai, 1000000000000));
    }
    return temp.replace(/\s+/g, " ");
}
