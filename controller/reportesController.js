import pdfGen from "html-pdf";
import fs from "fs";
import { createRequire } from 'module';
import path from "path";
import xls from "excel4node";
import { Parser } from "json2csv";

const require = createRequire(import.meta.url);

const home = (req,res) => {
    return res.render('reportes/home',{tituloPagina: "Reportes"});
}

const pdf = (req,res) => {
    
    // const ubicacionPlantilla = require.resolve( process.cwd() + '/views/reportes/pdf.html' );
    const ubicacionPlantilla = require.resolve(process.cwd() + '/views/reportes/pdf.html');

    let contenidoHTML = fs.readFileSync(ubicacionPlantilla, 'utf-8');

    let valor = 'Ola k ase?';
    let ruta = process.cwd();

    contenidoHTML = contenidoHTML.replace('{{valor}}', valor);
    contenidoHTML = contenidoHTML.replace('{{ruta}}', ruta);

    pdfGen.create(contenidoHTML).toStream( (error, stream) => {

        if(error) res.end("Error creando el PDF: " + error);
        else {
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        }


    });

}

const excel = (req,res) => {
    //Declarar el libro de trabajo
    const libro = new xls.Workbook();
    const hoja = libro.addWorksheet('Hoja 1');
    const style = libro.createStyle({
        font: {
            color: '#040404',
            size: 12
        }
    });
    const styleGreen = libro.createStyle({
        font: {
            color: '#388813',
            size: 12
        }
    });

    //Primera fila
    hoja.cell(1,1).string('ID').style(style);
    hoja.cell(1,2).string('Nombre').style(style);
    hoja.cell(1,3).string('Precio').style(style);

    const productos = [
        {
            id: '1',
            nombre: 'TV 48 pulgadas',
            precio: '9000'
        },
        {
            id: '2',
            nombre: 'Teléfono Xiaomi',
            precio: '800'
        },
        {
            id: '3',
            nombre: 'Mouse',
            precio: '30'
        }
    ];

    let i = 2;

    productos.forEach( producto => {
        const {id,nombre,precio} = producto;

        hoja.cell(i,1).string(id).style(style);
        hoja.cell(i,2).string(nombre).style(style);
        hoja.cell(i,3).string(precio).style(style);

        i++;
    });

    const timestamp = Math.floor(Date.now() / 1000);

    const pathExcel = path.join(process.cwd() + '/assets', 'excel', `reporte_${timestamp}.xlsx`);

    libro.write(pathExcel, (err, stats) => {
         if(err) console.log(err);
         else{
            res.download(pathExcel);
            return false;
         }
    });

}

const csv = (req,res) => {
    const productos = [
        {
            id: '1',
            nombre: 'TV 48 pulgadas',
            precio: '9000'
        },
        {
            id: '2',
            nombre: 'Teléfono Xiaomi',
            precio: '800'
        },
        {
            id: '3',
            nombre: 'Mouse',
            precio: '30'
        }
    ];

    const datos = Object.keys(productos[0]);
    const csv = new Parser({datos});

    const timestamp = Math.floor(Date.now() / 1000);
    const nombre = `Reporte_${timestamp}.csv`;

    fs.writeFile(process.cwd() + '/assets/csv/' + nombre, csv.parse(productos),
        err => {
            if(err) throw err;

            res.download(process.cwd() + '/assets/csv/' + nombre);
        }
    );

}

export {
    home,
    pdf,
    excel,
    csv
}