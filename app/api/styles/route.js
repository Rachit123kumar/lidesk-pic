import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import {prisma} from "../../../lib/prisma";
import {authOptions} from "../../api/auth/[...nextauth]/route";

export async function GET(request, response) {
    try{
        const session = await getServerSession(authOptions);
    if (!session) {
        console.log(session)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const styles = await prisma.style.findMany({
        
    });

    return NextResponse.json({
        success: true,
        styles,


    }, { status: 200 });

}catch(err){
     console.error('Error fetching styles:', err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}


}

