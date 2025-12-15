```markdown
Single-store Customer Lookup (Vercel + Supabase + OSM/Nominatim)

Γρήγορο guide για deploy:

1) Δημιούργησε λογαριασμό Supabase (https://supabase.com) και κάνε New Project.
   - Σημείωσε το DATABASE_URL / Connection string (Settings → Database → Connection string).
   - Στο SQL editor του Supabase τρέξε το αρχείο customers.sql (παρακάτω) για να φτιάξεις τον πίνακα.

2) Δημιούργησε GitHub repo και βάλε τα αρχεία που βρίσκονται σε αυτό το πακέτο (public/, api/, package.json, README.md).

3) Δημιούργησε λογαριασμό Vercel (https://vercel.com) και κάνε Import Project από το GitHub repo.
   - Στο Vercel Dashboard → Project Settings → Environment Variables όρισε:
     - DATABASE_URL = (το connection string από Supabase)
     - ADMIN_TOKEN = adm_3f8c9d2b7a6e
     - NOMINATIM_URL = https://nominatim.openstreetmap.org
   - Deploy.

4) Άνοιξε το live URL (π.χ. https://your-project.vercel.app/admin.html).
   - Βάλε το ADMIN_TOKEN όταν σου ζητηθεί.
   - Δοκίμασε αναζήτηση με τηλέφωνο (π.χ. +30...) — αν δεν υπάρχει, συμπλήρωσε και σώσε.

Σημειώσεις:
- Για μικρή/προσωπική χρήση το δημόσιο Nominatim είναι επαρκές. Για παραγωγή/όγκο σκέψου hosted geocoding.
- Ασφάλεια: Το ADMIN_TOKEN είναι απλό μέτρο. Για παραγωγή χρησιμοποίησε proper auth & HTTPS (Vercel παρέχει).
```
