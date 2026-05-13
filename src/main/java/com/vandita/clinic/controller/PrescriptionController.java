package com.vandita.clinic.controller;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.vandita.clinic.model.Medicine;
import com.vandita.clinic.model.Prescription;
import com.vandita.clinic.service.PrescriptionService;
import com.vandita.clinic.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public List<Prescription> getAll() {
        return prescriptionService.findAll();
    }

    @GetMapping("/patient/{phone}")
    public List<Prescription> getByPatient(@PathVariable String phone) {
        return prescriptionService.findByPhone(phone);
    }

    @PostMapping
    public Prescription create(@RequestBody Prescription prescription) {
        return prescriptionService.create(prescription);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) {
        return prescriptionService.findById(id).map(rx -> {
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                Document doc = new Document(PageSize.A4);
                PdfWriter.getInstance(doc, baos);
                doc.open();

                var settings = settingsService.getSettings();

                // Letterhead
                Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(0, 180, 216));
                Paragraph title = new Paragraph(settings.getClinicName(), titleFont);
                title.setAlignment(Element.ALIGN_CENTER);
                doc.add(title);

                Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
                Paragraph subTitle = new Paragraph(settings.getDoctorName() + " | " + settings.getQualification(), subTitleFont);
                subTitle.setAlignment(Element.ALIGN_CENTER);
                doc.add(subTitle);

                Paragraph contact = new Paragraph(settings.getAddress() + " | Phone: " + settings.getPhone(), FontFactory.getFont(FontFactory.HELVETICA, 10));
                contact.setAlignment(Element.ALIGN_CENTER);
                contact.setSpacingAfter(10);
                doc.add(contact);

                doc.add(new Paragraph("______________________________________________________________________________"));
                doc.add(new Paragraph(" "));

                // Patient info table
                PdfPTable infoTable = new PdfPTable(4);
                infoTable.setWidthPercentage(100);
                infoTable.addCell(getCell("Patient:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                infoTable.addCell(getCell(rx.getPatientName(), FontFactory.getFont(FontFactory.HELVETICA)));
                infoTable.addCell(getCell("Age/Gender:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                infoTable.addCell(getCell(rx.getPatientAge() + " / " + rx.getPatientGender(), FontFactory.getFont(FontFactory.HELVETICA)));
                infoTable.addCell(getCell("Date:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                infoTable.addCell(getCell(rx.getDate(), FontFactory.getFont(FontFactory.HELVETICA)));
                infoTable.addCell(getCell("ID:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                infoTable.addCell(getCell(rx.getId(), FontFactory.getFont(FontFactory.HELVETICA)));
                infoTable.setSpacingAfter(20);
                doc.add(infoTable);

                // Prescription header
                Font rxFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(0, 119, 168));
                doc.add(new Paragraph("Rx", rxFont));
                doc.add(new Paragraph(" "));

                // Medicines table
                PdfPTable medTable = new PdfPTable(new float[]{1, 4, 2, 2, 3, 2});
                medTable.setWidthPercentage(100);
                medTable.addCell(getHeaderCell("#"));
                medTable.addCell(getHeaderCell("Medicine"));
                medTable.addCell(getHeaderCell("Potency"));
                medTable.addCell(getHeaderCell("Dose"));
                medTable.addCell(getHeaderCell("Frequency"));
                medTable.addCell(getHeaderCell("Duration"));

                int i = 1;
                for (Medicine m : rx.getMedicines()) {
                    medTable.addCell(getCell(String.valueOf(i++), FontFactory.getFont(FontFactory.HELVETICA)));
                    medTable.addCell(getCell(m.getName(), FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                    medTable.addCell(getCell(m.getPotency(), FontFactory.getFont(FontFactory.HELVETICA)));
                    medTable.addCell(getCell(m.getDose(), FontFactory.getFont(FontFactory.HELVETICA)));
                    medTable.addCell(getCell(m.getFrequency(), FontFactory.getFont(FontFactory.HELVETICA)));
                    medTable.addCell(getCell(m.getDuration(), FontFactory.getFont(FontFactory.HELVETICA)));
                }
                medTable.setSpacingAfter(20);
                doc.add(medTable);

                // Advice
                if (rx.getAdvice() != null && !rx.getAdvice().isEmpty()) {
                    doc.add(new Paragraph("Advice:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                    doc.add(new Paragraph(rx.getAdvice(), FontFactory.getFont(FontFactory.HELVETICA)));
                    doc.add(new Paragraph(" "));
                }

                // Follow up
                if (rx.getFollowUpDate() != null && !rx.getFollowUpDate().isEmpty()) {
                    doc.add(new Paragraph("Follow-up Date: " + rx.getFollowUpDate(), FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                }

                doc.add(new Paragraph("\n\n\n\n"));
                Paragraph sign = new Paragraph("_____________________\nDoctor's Signature", FontFactory.getFont(FontFactory.HELVETICA));
                sign.setAlignment(Element.ALIGN_RIGHT);
                doc.add(sign);

                doc.close();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "prescription-" + id + ".pdf");
                return ResponseEntity.ok().headers(headers).body(baos.toByteArray());
            } catch (Exception e) {
                return ResponseEntity.internalServerError().<byte[]>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    private PdfPCell getCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(5);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private PdfPCell getHeaderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE)));
        cell.setBackgroundColor(new Color(0, 180, 216));
        cell.setPadding(5);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }
}
