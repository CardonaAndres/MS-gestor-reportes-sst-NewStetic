export class StaffAPI {
    static async getUsersToReport (token: string, addToUrl: string) {
        try {
            const req = await fetch(`${process.env.STAFF_SERVICE}/staff/to-reports${addToUrl}`, {
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}` 
                }
            });

            const data = await req.json();
            if(!req.ok) throw new Error(data.message || 'Error al hacer solicitud a la API' );

            return { success: true, data }

        } catch (err : any) {
            return { success: false, message: err?.message }
        }
    }
}