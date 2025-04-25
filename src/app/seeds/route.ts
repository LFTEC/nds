import { createTest } from "@/services";

export async function GET() {
    try {
        await createTest();
        return Response.json({message: "success"});
    }
    catch(error) {
        console.error(error);
        return Response.json({error}, {status: 500});
    }
    
}