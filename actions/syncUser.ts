import { user } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function syncUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    // console.log('\n\nClerk User: ', clerkUser);

    // check if user exists in DB
    const existing = await db.select().from(user).where(eq(user.clerkId, clerkUser.id));

    if (existing.length === 0) {
        // if not, create new
        await db.insert(user).values({
            clerkId: clerkUser.id,
            name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            avatarUrl: clerkUser.imageUrl ?? null
        });
    } else {
        // if exists, update info
        await db.update(user)
            .set({
                name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
                email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                avatarUrl: clerkUser.imageUrl ?? null,
                bio: typeof clerkUser.publicMetadata.bio === "string" ? clerkUser.publicMetadata.bio : null,
            })
            .where(eq(user.clerkId, clerkUser.id));
    }

    return clerkUser;
}

/*
Clerk User:  _User {
  id: 'user_32BDlhDwdBdXxmzGfxSzmkL4c7p',
  passwordEnabled: false,
  totpEnabled: false,
  backupCodeEnabled: false,
  twoFactorEnabled: false,
  banned: false,
  locked: false,
  createdAt: 1756885224634,
  updatedAt: 1756885458151,
  imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMkJEbGdtUkhXY0t2dmpuNnphdm1VSGFLUnAifQ',
  hasImage: true,
  primaryEmailAddressId: 'idn_32BDM77nJteGjBlPpOgsrwrHPn6',
  primaryPhoneNumberId: null,
  primaryWeb3WalletId: null,
  lastSignInAt: 1756885458125,
  externalId: null,
  username: 'rohit',
  firstName: 'Rohit Kumar',
  lastName: 'Yadav',
  publicMetadata: {},
  privateMetadata: {},
  unsafeMetadata: {},
  emailAddresses: [
    _EmailAddress {
      id: 'idn_32BDM77nJteGjBlPpOgsrwrHPn6',
      emailAddress: 'rohitkuyada@gmail.com',
      verification: [_Verification],
      linkedTo: [Array]
    }
  ],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [
    _ExternalAccount {
      id: 'idn_32BDM44vxSI67fI5anl8zDDWHDm',
      provider: 'oauth_google',
      identificationId: 'idn_32BDM44vxSI67fI5anl8zDDWHDm',
      externalId: '102190363334925568192',
      approvedScopes: 'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
      emailAddress: 'rohitkuyada@gmail.com',
      firstName: 'Rohit Kumar',
      lastName: 'Yadav',
      imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLNFljUVBxbHNJNlVUZkZ3ZlI1SUhrMFhTb2V2RXB4RDJlZmh2RW14WnB0RzFLdVdYOEJnPXMxMDAwLWMiLCJzIjoibGMySFMxOFkyTy9qdTNYUWVsZlhxWHpGSHFzelZPU0J5Q1luRVU1MTZ4NCJ9',
      username: null,
      phoneNumber: undefined,
      publicMetadata: {},
      label: null,
      verification: [_Verification]
    }
  ],
  samlAccounts: [],
  lastActiveAt: 1756885224633,
  createOrganizationEnabled: true,
  createOrganizationsLimit: null,
  deleteSelfEnabled: true,
  legalAcceptedAt: null,
  _raw: {
    id: 'user_32BDlhDwdBdXxmzGfxSzmkL4c7p',
    object: 'user',
    username: 'rohit',
    first_name: 'Rohit Kumar',
    last_name: 'Yadav',
    image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMkJEbGdtUkhXY0t2dmpuNnphdm1VSGFLUnAifQ',        
    has_image: true,
    primary_email_address_id: 'idn_32BDM77nJteGjBlPpOgsrwrHPn6',
    primary_phone_number_id: null,
    primary_web3_wallet_id: null,
    password_enabled: false,
    two_factor_enabled: false,
    totp_enabled: false,
    backup_code_enabled: false,
    email_addresses: [ [Object] ],
    phone_numbers: [],
    web3_wallets: [],
    passkeys: [],
    external_accounts: [ [Object] ],
    saml_accounts: [],
    enterprise_accounts: [],
    public_metadata: {},
    private_metadata: {},
    unsafe_metadata: {},
    external_id: null,
    last_sign_in_at: 1756885458125,
    banned: false,
    locked: false,
    lockout_expires_in_seconds: null,
    verification_attempts_remaining: 100,
    created_at: 1756885224634,
    updated_at: 1756885458151,
    delete_self_enabled: true,
    create_organization_enabled: true,
    last_active_at: 1756885224633,
    mfa_enabled_at: null,
    mfa_disabled_at: null,
    legal_accepted_at: null,
    profile_image_url: 'https://images.clerk.dev/oauth_google/img_32BDLgmRHWcKvvjn6zavmUHaKRp'
  }
}
*/