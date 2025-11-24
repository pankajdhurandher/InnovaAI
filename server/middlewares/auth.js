import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan

export const auth = async (req, res, next)=>{
    try {
        const {userId, has} = await req.auth();
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

         req.plan = hasPremiumPlan ? 'premium' : 'free';

         //                                                           TO MAKE FREE TO ALL USERS

        // req.plan = "premium";
        // req.free_usage = 0;

        // 1111
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// // all premium version 

// import { clerkClient } from "@clerk/express";

// // Middleware to check userId and hasPremiumPlan

// export const auth = async (req, res, next) => {
//     try {
//         const { userId, has } = await req.auth();
        
//         // --------------------------------------------------------
//         // VERSION 1: NORMAL PREMIUM SYSTEM (DEFAULT)
//         // --------------------------------------------------------
//         // ⭐ Keep this active for premium + free usage limit
//         // let hasPremiumPlan = await has({ plan: 'premium' });

//         // const user = await clerkClient.users.getUser(userId);

//         // if (!hasPremiumPlan && user.privateMetadata.free_usage) {
//         //     req.free_usage = user.privateMetadata.free_usage;
//         // } else {
//         //     await clerkClient.users.updateUserMetadata(userId, {
//         //         privateMetadata: {
//         //             free_usage: 0
//         //         }
//         //     });
//         //     req.free_usage = 0;
//         // }

//         // --------------------------------------------------------
//         // VERSION 2: ALL USERS PREMIUM (FREE MODE)
//         // --------------------------------------------------------
//         //
//         // ⭐ To make all features free:
//         //    1️⃣ Comment the entire NORMAL PREMIUM section above
//         //    2️⃣ UNCOMMENT the 2 lines below
//         //
//          hasPremiumPlan = true;    // 🔥 Everyone is premium
//          req.free_usage = 0;       // 🔥 No free usage limit
//         //
//         // --------------------------------------------------------

//         req.plan = hasPremiumPlan ? 'premium' : 'free';
//         next();
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };





