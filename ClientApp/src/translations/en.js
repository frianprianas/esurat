export const en = {
    app_name: "E-Letter",
    subtitle: "Digital Letter Administration",
    menu: {
        dashboard: "Dashboard",
        surat_masuk: "Incoming Letters",
        surat_keluar: "Outgoing Letters",
        master_data: "Master Data",
        kelola_perihal: "Manage Categories",
        visualisasi: "Visualization",
        visual_masuk: "Visual Incoming",
        visual_keluar: "Visual Outgoing",
        sistem: "System",
        manajemen_pengguna: "User Management",
        notifikasi: "Monthly Notifications"
    },
    common: {
        logged_in_as: "Logged in as",
        logout: "Logout",
        search_placeholder: "Search letters...",
        loading: "Loading...",
        action: "Action",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
        send: "Send"
    },
    dashboard: {
        total_masuk: "Total Incoming",
        total_keluar: "Total Outgoing",
        active_users: "Active Users",
        categories: "Letter Categories",
        recent_activity: "Recent Activity",
        calendar_title: "Letter Calendar",
        letters: "Letters",
        more: "others...",
        incoming: "Incoming",
        outgoing: "Outgoing",
        welcome: "Welcome, Admin!",
        overview: "Statistics Overview",
        shortcut_desc: "Shortcut for letter activities"
    },
    categories: {
        title: "Manage Categories",
        add_title: "Add New Category",
        edit_title: "Edit Category",
        name_label: "Category Name",
        placeholder: "Example: Meeting Invitation",
        save_changes: "Save Changes",
        list_title: "Category List",
        table_name: "Category Name",
        empty_list: "No categories found",
        alert_delete: "Delete this category?",
        alert_delete_fail: "Failed to delete category",
        alert_save_fail: "Failed to save category"
    },
    auth: {
        welcome_back: "Welcome Back!",
        login_subtitle: "Please login to access the dashboard.",
        username: "Username",
        password: "Password",
        enter_username: "Enter username",
        enter_password: "Enter password",
        login_button: "LOGIN",
        error_invalid: "Invalid username or password",
        footer: "School Letter Application",
        click_to_login: "Click here to Login"
    },
    users: {
        title: "User Management",
        add_user: "Add User",
        table: {
            username: "Username",
            role: "Role",
            access: "Access Rights",
            action: "Action"
        },
        access: {
            surat_masuk: "Incoming Letters",
            surat_keluar: "Outgoing Letters",
            perihal: "Categories"
        },
        modal: {
            edit_title: "Edit User",
            add_title: "Add New User",
            manage_masuk: "Manage Incoming",
            manage_keluar: "Manage Outgoing",
            manage_perihal: "Manage Categories",
            save: "Save Changes",
            cancel: "Cancel"
        },
        alert: {
            save_fail: "Failed to save user data",
            delete_confirm: "Are you sure you want to delete this user?",
            delete_fail: "Failed to delete user"
        }
    },
    notifications: {
        title: "Monthly Notifications List",
        send_now: "Send Now",
        add_recipient: "Add Recipient",
        table: {
            name: "Name",
            whatsapp: "WhatsApp",
            email: "Email",
            action: "Action",
            empty: "No notification recipients found"
        },
        send_modal: {
            title: "Confirm Send Notification",
            instruction: "Enter admin password to manually send notifications now.",
            placeholder: "Admin Password",
            sending: "Sending...",
            send: "Send",
            cancel: "Cancel"
        },
        recipient_modal: {
            edit_title: "Edit Recipient",
            add_title: "Add New Recipient",
            full_name: "Full Name",
            whatsapp_label: "WhatsApp No.",
            whatsapp_placeholder: "Example: 08123456789",
            email_label: "Email Address",
            helper_text: "Notifications will be sent to this email on the 1st of every month.",
            save: "Save",
            cancel: "Cancel"
        },
        alert: {
            password_empty: "Password cannot be empty",
            success_queued: "Notifications successfully queued!",
            send_fail: "Failed to send notifications.",
            save_fail: "Failed to save data",
            delete_confirm: "Delete this data?",
            delete_fail: "Failed to delete data",
            timeout: "No response from server (Timeout). Process might be running in background.",
            auth_fail: "Incorrect password. Access denied."
        }
    },
    letters: {
        incoming: {
            title: "Incoming Letters",
            add: "+ Add New",
            cancel: "Cancel",
            table: {
                no_surat: "Letter No.",
                sender: "Sender",
                subject: "Subject",
                date: "Date",
                file: "File",
                actions: "Action",
                empty: "No incoming letters found."
            }
        },
        outgoing: {
            title: "Outgoing Letters",
            add: "+ Add New",
            cancel: "Cancel",
            table: {
                no_surat: "Letter No.",
                receiver: "Receiver",
                subject: "Subject",
                date: "Date",
                file: "File",
                actions: "Action",
                empty: "No outgoing letters found."
            }
        },
        form: {
            number: "Letter Number",
            sender: "Sender",
            receiver: "Receiver",
            subject: "Subject",
            select_subject: "-- Select Subject --",
            date: "Letter Date",
            upload: "Upload Document",
            format_hint: "Format: PDF, DOC, DOCX, ODT, JPEG",
            save: "Save Letter"
        },
        alert: {
            save_success_offline: "Data saved successfully (Offline/Demo Mode)",
            save_success: "Data saved successfully!",
            save_fail: "Failed to save data",
            delete_confirm: "Delete this data?"
        },
        preview: {
            view: "View Preview",
            download: "Download",
            download_file: "Download File",
            download_now: "Download Now",
            unavailable_title: "Preview Unavailable",
            unavailable_desc: "Browser does not support direct preview for this format. Please download the file to view it.",
            unavailable_desc_short: "This file format cannot be displayed directly."
        }
    },
    pagination: {
        showing: "Showing",
        to: "-",
        from: "of",
        data: "data"
    },
    visual: {
        title: "Archive Visual: Letters",
        incoming: "Incoming",
        outgoing: "Outgoing",
        hint: "Click page corner to flip",
        empty: "No data to display.",
        page: "Page",
        cover: {
            app_name: "DIGITAL ARCHIVE",
            year: "Year",
            end_title: "End of Document",
            end_desc: "All archives have been displayed.",
            back_to_start: "Back to Start"
        },
        detail: {
            sender: "Sender: ",
            receiver: "Receiver: ",
            view: "View Details",
            no_doc: "No document"
        }
    },
    addin: {
        title: "Upload to E-Surat",
        status: {
            ready: "Ready.",
            connected: "Connected to MS Word.",
            not_in_word: "Please open this page inside MS Word.",
            reading: "Reading document...",
            uploading: "Uploading to server...",
            success: "✅ SUCCESS! Letter sent.",
            fail: "❌ Upload failed",
            error_read: "Failed to read file",
            error_slice: "Failed to get slice."
        },
        button: {
            upload: "Upload PDF",
            sending: "Sending..."
        },
        alert: {
            must_in_word: "Must be run inside MS Word!"
        },
        footer: {
            server_hint: "Ensure API Server is running.",
            convert_hint: "Document will be automatically converted to PDF."
        },
        data: {
            sender_default: "MS Word User",
            subject_default: "Document from MS Word Add-in"
        }
    },
    layout: {
        no_results: "No data found.",
        to_recipient: "To:"
    }
}
