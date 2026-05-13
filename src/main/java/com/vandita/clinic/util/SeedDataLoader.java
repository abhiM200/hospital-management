package com.vandita.clinic.util;

import com.vandita.clinic.model.*;
import com.vandita.clinic.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class SeedDataLoader implements CommandLineRunner {

    @Autowired private InMemoryStore store;
    @Autowired private IdGenerator idGen;

    @Override
    public void run(String... args) {
        seedAppointments();
        seedPrescriptions();
        seedBlogPosts();
        seedPatients();
    }

    private void seedAppointments() {
        String today = LocalDate.now().toString();
        String yesterday = LocalDate.now().minusDays(1).toString();
        String tomorrow = LocalDate.now().plusDays(1).toString();
        String lastWeek = LocalDate.now().minusDays(7).toString();
        String nextWeek = LocalDate.now().plusDays(7).toString();

        store.appointments.addAll(List.of(
            Appointment.builder().id(idGen.uuid()).patientName("Ramesh Kumar")
                .phone("9876543210").age(45).gender("male").date(today)
                .slot("10:00 AM").consultationType("in-person")
                .symptoms("Chronic migraine for 2 years").status("confirmed")
                .createdAt(yesterday).email("ramesh@example.com").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Priya Sharma")
                .phone("8765432109").age(28).gender("female").date(today)
                .slot("11:00 AM").consultationType("in-person")
                .symptoms("PCOD, irregular periods, weight gain").status("confirmed")
                .createdAt(yesterday).email("priya@example.com").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Amit Verma")
                .phone("7654321098").age(35).gender("male").date(today)
                .slot("12:00 PM").consultationType("video")
                .symptoms("Eczema on hands and legs").status("pending")
                .createdAt(today).email("amit@example.com").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Sunita Devi")
                .phone("6543210987").age(52).gender("female").date(yesterday)
                .slot("10:00 AM").consultationType("in-person")
                .symptoms("Hypothyroid, fatigue, weight gain").status("completed")
                .createdAt(lastWeek).email("").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Vikash Singh")
                .phone("9998887776").age(22).gender("male").date(tomorrow)
                .slot("04:00 PM").consultationType("in-person")
                .symptoms("Recurrent tonsillitis").status("pending")
                .createdAt(today).email("vikash@example.com").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Meena Gupta")
                .phone("8887776665").age(40).gender("female").date(tomorrow)
                .slot("05:00 PM").consultationType("video")
                .symptoms("Anxiety, stress, insomnia").status("confirmed")
                .createdAt(today).email("meena@example.com").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Rajan Mishra")
                .phone("7776665554").age(60).gender("male").date(lastWeek)
                .slot("09:00 AM").consultationType("in-person")
                .symptoms("Knee joint pain").status("completed")
                .createdAt(lastWeek).email("").build(),
            Appointment.builder().id(idGen.uuid()).patientName("Kavita Pandey")
                .phone("6665554443").age(33).gender("female").date(nextWeek)
                .slot("10:30 AM").consultationType("in-person")
                .symptoms("Acne, dark spots, oily skin").status("pending")
                .createdAt(today).email("kavita@example.com").build()
        ));
    }

    private void seedPrescriptions() {
        String lastWeek = LocalDate.now().minusDays(7).toString();
        store.prescriptions.addAll(List.of(
            Prescription.builder().id(idGen.uuid()).patientName("Sunita Devi")
                .patientPhone("6543210987").patientAge(52).patientGender("female").date(lastWeek)
                .medicines(List.of(
                    new Medicine("Thyroidinum","3X","4 tablets","Twice daily","30 days"),
                    new Medicine("Calcarea Carb","200C","4 pills","Weekly","3 months"),
                    new Medicine("Lycopodium","30C","4 pills","Twice daily","30 days")))
                .advice("Avoid raw cabbage, cauliflower. Drink 3L water daily.")
                .followUpDate(LocalDate.now().plusDays(23).toString())
                .doctorNote("TSH re-check after 6 weeks.").build(),
            Prescription.builder().id(idGen.uuid()).patientName("Rajan Mishra")
                .patientPhone("7776665554").patientAge(60).patientGender("male").date(lastWeek)
                .medicines(List.of(
                    new Medicine("Rhus Tox","30C","4 pills","Three times daily","14 days"),
                    new Medicine("Bryonia Alba","200C","4 pills","Once daily","14 days"),
                    new Medicine("Arnica Montana","6C","4 pills","Four times daily","7 days")))
                .advice("Warm compress on knee. Avoid cold and damp environments.")
                .followUpDate(LocalDate.now().plusDays(21).toString())
                .doctorNote("Moderate arthritis. Constitutional treatment initiated.").build()
        ));
    }

    private void seedBlogPosts() {
        store.blogPosts.addAll(List.of(
            BlogPost.builder().id(idGen.uuid())
                .title("What is Homeopathy? A Beginner's Complete Guide")
                .category("Education").slug("what-is-homeopathy")
                .excerpt("Discover the principles behind homeopathy — the 200-year-old system of natural medicine.")
                .content("Homeopathy is a system of alternative medicine developed in 1796 by Samuel Hahnemann based on the doctrine of 'like cures like'. Remedies are prepared through serial dilution called potentization. Classical homeopathy finds the single most similar remedy for each patient based on their complete symptom picture including mental, emotional, and physical aspects.")
                .coverImageUrl("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800")
                .tags("homeopathy,basics,education").readTime("8 min read")
                .createdAt(LocalDate.now().minusDays(5).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Treating Skin Diseases with Homeopathy: Eczema, Psoriasis & Acne")
                .category("Skin").slug("skin-diseases-homeopathy")
                .excerpt("Constitutional homeopathic treatment addresses root causes of chronic skin conditions.")
                .content("Skin diseases are among the most successfully treated conditions in homeopathy. For Eczema: Graphites, Sulphur, Arsenicum Album. For Psoriasis: constitutional remedies based on totality. For Acne: Pulsatilla (hormonal), Sulphur (inflamed), Hepar Sulph (infected). Treatment takes 3-12 months depending on chronicity.")
                .coverImageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800")
                .tags("skin,eczema,psoriasis,acne").readTime("10 min read")
                .createdAt(LocalDate.now().minusDays(4).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Thyroid Disorders and Homeopathy: A Natural Approach")
                .category("Hormonal").slug("thyroid-homeopathy")
                .excerpt("Can homeopathy help thyroid patients reduce medication? Explore natural approaches.")
                .content("Thyroid disorders affect millions, particularly women. Homeopathy addresses the whole person. For Hypothyroidism: Thyroidinum 3X, Calcarea Carb, Lycopodium, Sepia. Many patients reduce thyroxine dosage under medical supervision. Regular TSH monitoring is recommended throughout treatment.")
                .coverImageUrl("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800")
                .tags("thyroid,hormonal,hypothyroid").readTime("9 min read")
                .createdAt(LocalDate.now().minusDays(3).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Migraine Management with Homeopathy: Lasting Relief")
                .category("Neurological").slug("migraine-homeopathy")
                .excerpt("Homeopathy offers long-term migraine prevention by treating susceptibility, not just pain.")
                .content("Migraine is a neurological condition that significantly impacts quality of life. Key remedies: Belladonna (throbbing, right-sided), Iris Versicolor (with aura), Natrum Mur (from sun or grief), Sanguinaria (right-sided periodic), Spigelia (left-sided stabbing). Patients see 50-70% reduction in frequency within 3-6 months.")
                .coverImageUrl("https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800")
                .tags("migraine,headache,neurological").readTime("11 min read")
                .createdAt(LocalDate.now().minusDays(2).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Homeopathy for Children: Safe, Gentle, Effective")
                .category("Pediatric").slug("homeopathy-for-children")
                .excerpt("Why more parents are turning to homeopathy for children's recurrent infections and allergies.")
                .content("Children respond beautifully to homeopathic treatment. Conditions treated: Recurrent tonsillitis (Baryta Carb, Belladonna), Ear infections (Pulsatilla, Chamomilla), Bedwetting (Causticum), Recurrent colds (Tuberculinum, Calcarea Carb), ADHD (Stramonium, Tarentula). Homeopathy does not interfere with vaccines.")
                .coverImageUrl("https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800")
                .tags("children,pediatric,kids").readTime("7 min read")
                .createdAt(LocalDate.now().minusDays(1).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Stress, Anxiety and Depression: Homeopathy's Holistic Approach")
                .category("Mental Health").slug("stress-anxiety-homeopathy")
                .excerpt("Mental health conditions respond exceptionally well to homeopathy's mind-body approach.")
                .content("In homeopathy, mental and emotional symptoms are the most important part of the case. For anxiety: Argentum Nitricum, Arsenicum Album, Aconite, Ignatia, Gelsemium. For depression: Natrum Mur, Sepia, Aurum Met, Pulsatilla. Homeopathy works alongside conventional psychiatric treatment — never stop medications abruptly.")
                .coverImageUrl("https://images.unsplash.com/photo-1547750159-b6c7b9b84b39?w=800")
                .tags("stress,anxiety,depression,mental health").readTime("10 min read")
                .createdAt(LocalDate.now().toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("PCOD/PCOS: Homeopathic Solutions for Hormonal Balance")
                .category("Women's Health").slug("pcod-pcos-homeopathy")
                .excerpt("Homeopathy offers a hormonal-balancing, side-effect-free approach to PCOD management.")
                .content("PCOD affects 1 in 5 women of reproductive age. Key remedies: Pulsatilla, Sepia, Natrum Mur, Lachesis, Thuja — chosen based on constitution. Regular periods return within 3-6 months. Combined with low GI diet and exercise, results are significantly enhanced.")
                .coverImageUrl("https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800")
                .tags("pcod,pcos,women,hormonal").readTime("12 min read")
                .createdAt(LocalDate.now().minusDays(6).toString()).published(false).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Hair Fall Treatment with Homeopathy: Root Cause Solutions")
                .category("Hair Care").slug("hair-fall-homeopathy")
                .excerpt("Homeopathy treats constitutional causes of hair fall rather than just stimulating growth.")
                .content("Hair fall causes and remedies: Stress-induced (Phosphoric Acid, Natrum Mur), Post-partum (Sepia, Phosphorus), Hormonal PCOD (Sepia, Pulsatilla), Dandruff (Sulphur, Graphites), Alopecia Areata (Fluoricum Acidum, Phosphorus), Premature greying (Phosphoric Acid, Lycopodium). Treatment duration: 4-6 months for significant improvement.")
                .coverImageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800")
                .tags("hair fall,alopecia,hair care").readTime("8 min read")
                .createdAt(LocalDate.now().minusDays(8).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Allergies and Asthma: Homeopathy's Immune Balancing Approach")
                .category("Immune").slug("allergies-asthma-homeopathy")
                .excerpt("Homeopathy desensitizes and rebalances the immune system naturally for lasting allergy relief.")
                .content("Allergies represent an over-reactive immune system. Rhinitis remedies: Allium Cepa, Sabadilla, Natrum Mur, Arsenicum Album. Urticaria: Apis Mellifica, Urtica Urens, Rhus Tox. Asthma: Arsenic Album, Pulsatilla, Blatta Orientalis, Natrum Sulph. Seasonal allergies improve within one season; chronic asthma requires 1-2 years.")
                .coverImageUrl("https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800")
                .tags("allergy,asthma,rhinitis,immune").readTime("9 min read")
                .createdAt(LocalDate.now().minusDays(10).toString()).published(true).author("Dr. Vandita").build(),
            BlogPost.builder().id(idGen.uuid())
                .title("Diabetes Management with Homeopathy: A Complementary Strategy")
                .category("Lifestyle").slug("diabetes-homeopathy")
                .excerpt("Homeopathy offers powerful complementary support for better diabetes management.")
                .content("Homeopathy is used alongside conventional diabetes medications — never as a replacement. Key remedies: Uranium Nitricum (glycosuria), Syzygium Jambolanum (blood sugar reduction), Phosphoric Acid (neuropathy), Lycopodium (digestive complications), Calcarea Carb (obese type). Continue conventional medication and maintain HbA1c monitoring.")
                .coverImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800")
                .tags("diabetes,blood sugar,lifestyle").readTime("11 min read")
                .createdAt(LocalDate.now().minusDays(12).toString()).published(true).author("Dr. Vandita").build()
        ));
    }

    private void seedPatients() {
        store.appointments.forEach(appt -> store.patients.merge(appt.getPhone(),
            Patient.builder().id(idGen.uuid()).name(appt.getPatientName())
                .phone(appt.getPhone()).age(appt.getAge()).gender(appt.getGender())
                .email(appt.getEmail() != null ? appt.getEmail() : "")
                .registeredAt(appt.getCreatedAt()).lastVisit(appt.getDate()).visitCount(1).build(),
            (existing, n) -> { existing.setVisitCount(existing.getVisitCount() + 1); return existing; }
        ));
    }
}
