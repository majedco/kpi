from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework import permissions

from .models.object_permission import get_anonymous_user

def _get_perm_name(perm_name_prefix, model_instance):
    '''
    Get the type-specific permission name for a model from a permission name
    prefix and a model instance.

    Example:
        >>>self._get_perm_name('view_', my_survey_asset)
        'view_surveyasset'

    :param perm_name_prefix: Prefix of the desired permission name (i.e.
        "view_", "change_", or "delete_").
    :type perm_name_prefix: str
    :param model_instance: An instance of the model for which the permission
        name is desired.
    :type model_instance: :py:class:`Collection` or :py:class:`SurveyAsset`
    :return: The computed permission name.
    :rtype: str
    '''
    perm_name= Permission.objects.get(
        content_type= ContentType.objects.get_for_model(model_instance),
        codename__startswith=perm_name_prefix
    ).natural_key()[0]
    return perm_name


# FIXME: Name is no longer accurate.
class IsOwnerOrReadOnly(permissions.DjangoObjectPermissions):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    # Setting this to False allows real permission checking on AnonymousUser.
    # With the default of True, anonymous requests are categorically rejected.
    authenticated_users_only = False

    perms_map = permissions.DjangoObjectPermissions.perms_map
    perms_map['GET']= ['%(app_label)s.view_%(model_name)s']
    perms_map['OPTIONS']= perms_map['GET']
    perms_map['HEAD']= perms_map['GET']
